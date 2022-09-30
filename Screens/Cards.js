import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Animated,
  TextInput,
  TouchableOpacity,
  Modal
} from "react-native";
import { Card, Title } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";

//Custom import
import ButtonComponent from "../Components/ButtonComponent";
import colors from "../Constants/colors";

function Cards({ route }) {
  //Receiving flashcard params
  const { itemId, topic } = route.params;

  const [isFlipped, setIsFlipped] = useState(false);
  const [cardQuestions, setCardQuestions] = useState([]);
  const [cardAnswers, setCardAnswers] = useState([]);
  const [question, setQuestion] = useState();
  const [answer, setAnswer] = useState();
  const [cardCounter, setCardCounter] = useState(0);
  const [error, setError] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  const animate = useRef(new Animated.Value(0));


  //storing user question
  const storeQuestionData = async () => {
    try {
      await AsyncStorage.setItem(
        `${topic} + ${itemId} + questions`,
        JSON.stringify(cardQuestions)
      );
    } catch (error) {
      console.log(error);
    }
  };

  //storing user answer
  const storeAnswerData = async () => {
    try {
      await AsyncStorage.setItem(
        `${topic} + ${itemId} + answers`,
        JSON.stringify(cardAnswers)
      );
    } catch (error) {
      console.log(error);
    }
  };

  //asynchronous loading of data based on logged in user
  const getQuestionData = async () => {
    try {
      const result = await AsyncStorage.getItem(
        `${topic} + ${itemId} + questions`
      );
      if (result !== null) {
        setCardQuestions([...JSON.parse(result)]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAnswerData = async () => {
    try {
      const result = await AsyncStorage.getItem(
        `${topic} + ${itemId} + answers`
      );
      if (result !== null) {
        setCardAnswers([...JSON.parse(result)]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Storing async data
  useEffect(() => {
    storeQuestionData();
    storeAnswerData();
  });

  const [appLoaded, setAppLoaded] = useState(false);
  if (!appLoaded) {
    return (
      <AppLoading
        startAsync={() => {
          getQuestionData();
          getAnswerData();
        }}
        onFinish={() => setAppLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  function FlipCard(props) {
    return (
      <Card style={{ width: 300, height: 200 }}>
        <Card.Content>
          <Title
            style={{
              textAlign: "center",
              fontFamily: "open-sans-bold",
              fontSize: 25,
            }}
          >
            {props.topic}
          </Title>
          <View style={styles.content}>
            <Text style={{ textAlign: "center" }}>
              {props.label1}
              {props.answer}
            </Text>
            <Text style={{ textAlign: "center" }}>
              {props.label2}
              {props.question}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  }

  //Handling new card input values
  function handleCardInput() {
    if (!answer || !question) {
      setError(
        "Please enter values in both the question and answer field to save"
      );
      return;
    } else {
      setCardQuestions([...cardQuestions, question]);
      setCardAnswers([...cardAnswers, answer]);
      setQuestion(null);
      setAnswer(null);
      setError(null);

      //Outputing the question that was just entered
      setCardCounter(cardQuestions.length);
    }
  }

  //Handling deletion of questions and answers
  function deleteQuestionAndAnswer() {
    let questionsCopy = [...cardQuestions];
    let answersCopy = [...cardAnswers];

    questionsCopy.splice(cardCounter, 1);
    answersCopy.splice(cardCounter, 1);

    if (questionsCopy.length === 0) {
      setCardQuestions(questionsCopy);
      setCardAnswers(answersCopy);
      setCardCounter(0);
      setError("Card is empty");
    } else {
      setCardQuestions(questionsCopy);
      setCardAnswers(answersCopy);
      setCardCounter(cardCounter - 1);
    }
  }

  function handleEditQuestionAndAnswer() {
    //Checks if the input field is empty, if true it does nothing
    if (!question || !answer) {
      setError(
        "Please enter values in both the question and answer field to edit"
      );
      return;
    } else {
      cardQuestions[cardCounter] = question;
      cardAnswers[cardCounter] = answer;
      setAnswer(null);
      setQuestion(null);
      setError(null);
    }
  }

  //Handling flip card animation
  function handleFlip() {
    Animated.timing(animate.current, {
      duration: 300,
      toValue: isFlipped ? 0 : 180,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(!isFlipped);
    });
  }

  const interpolateFront = animate.current.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const interpolateBack = animate.current.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <View style={styles.screen}>
      <Text
        style={{ color: colors.red, fontFamily: "open-sans-bold", padding: 10, textAlign: "center" }}
      >
        {error}
      </Text>
      <View>
        {/* Handling card flip animation */}
        <TouchableOpacity onPress={() => handleFlip()}>
          {/* Back Card */}
          <Animated.View
            style={[
              styles.back,
              styles.hidden,
              { transform: [{ rotateY: interpolateBack }] },
            ]}
          >
            <FlipCard
              topic={topic}
              label1="Answer: "
              answer={cardAnswers[cardCounter]}
            />
          </Animated.View>

          {/* Front Card */}
          <Animated.View
            style={[
              { transform: [{ rotateY: interpolateFront }] },
              styles.hidden,
            ]}
          >
            <FlipCard
              topic={topic}
              label2="Question: "
              question={cardQuestions[cardCounter]}
            />
          </Animated.View>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 10,
            paddingBottom: 30,
          }}
        >
          {/* handling backward navigation */}
          <TouchableOpacity
            onPress={() => {
              if (cardCounter > 0) setCardCounter(cardCounter - 1);
              else return;
            }}
          >
            <Ionicons
              name="arrow-back-circle"
              size={40}
              color={colors.primaryColor}
            />
          </TouchableOpacity>

          {/* handling edits */}
          <TouchableOpacity onPress={() => setModalVisible2(true)}>
            <Ionicons name="pencil" size={35} color={colors.secondaryColor} />
          </TouchableOpacity>

          {/* handling deletions */}
          <TouchableOpacity onPress={() => deleteQuestionAndAnswer()}>
            <Ionicons name="trash-bin" size={35} color={colors.red} />
          </TouchableOpacity>

          {/* handling forward navigation */}
          <TouchableOpacity
            onPress={() => {
              if (cardCounter < cardQuestions.length - 1)
                setCardCounter(cardCounter + 1);
              else return;
            }}
          >
            <Ionicons
              name="arrow-forward-circle"
              size={40}
              color={colors.primaryColor}
            />
          </TouchableOpacity>
        </View>
      </View>


      {/*Add card modal*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.changeText}>
            <View style={styles.container}>
              <TextInput
                style={styles.input}
                placeholder={"Write Question"}
                value={question}
                onChangeText={(text) => setQuestion(text)}
              />
              <TextInput
                style={styles.input}
                placeholder={"Write Answer"}
                value={answer}
                onChangeText={(text) => setAnswer(text)}
              />
              <View
                style={{
                  width: 70,
                  margin: 10,
                  alignSelf: "center",
                }}
              >
                <ButtonComponent
                  title="Save"
                  doSomething={() => handleCardInput()}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
                  paddingBottom: 5,
                }}
              >
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/*Edit card modal*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          setModalVisible2(!modalVisible2);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.changeText}>
            <View style={styles.container}>
              <TextInput
                style={styles.input}
                placeholder={"Edit Question"}
                value={question}
                onChangeText={(text) => setQuestion(text)}
              />
              <TextInput
                style={styles.input}
                placeholder={"Edit Answer"}
                value={answer}
                onChangeText={(text) => setAnswer(text)}
              />
              <View
                style={{
                  width: 70,
                  margin: 10,
                  alignSelf: "center",
                }}
              >
                <ButtonComponent
                  title="Save"
                  doSomething={() => handleEditQuestionAndAnswer()}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
                  paddingBottom: 5,
                }}
              >
              </View>
            </View>
          </View>
        </View>
      </Modal>


      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.addWrapper}>
          <Text>
            <Ionicons name="add" color="white" size={30} />
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingBottom: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f8ff"
  },
  hidden: {
    backfaceVisibility: "hidden",
  },
  back: {
    position: "absolute",
    top: 0,
  },
  container: {
    justifyContent: "center",
    marginHorizontal: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 5,
    backgroundColor: "white",
    borderRadius: 10,
  },
  content: {
    justifyContent: "center",
    fontFamily: "open-sans-bold",
    fontSize: 20,
    flexDirection: "row",
    margin: 10,
  },
  loweredView: {
    position: "absolute",
    bottom: 30,
  },
  changeText: {
    alignItems: "center",
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 60,
    width: 250,
    borderColor: colors.primaryColor,
    color: "black",
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: "3%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: colors.primaryColor,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Cards;
