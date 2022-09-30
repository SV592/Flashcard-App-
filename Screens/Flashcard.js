import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
    Keyboard,
    FlatList,
} from "react-native";

//Icons
import { Ionicons } from "@expo/vector-icons";

//Navigation
import { useNavigation } from "@react-navigation/native";

//App loading
import AppLoading from "expo-app-loading";

//Async Storage
import AsyncStorage from "@react-native-async-storage/async-storage";

//Constants
import colors from "../Constants/colors";

//Custom Components
import ButtonComponent from "../Components/ButtonComponent";

//Splashscreen 
import * as SplashScreen from "expo-splash-screen";

//Keeps the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();


function FlashCards() {
    const [editTopic, setEditTopic] = useState();
    const [index, setIndex] = useState();
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [topics, setTopics] = useState([]);
    const [topic, setTopic] = useState();

    const navigation = useNavigation();

    //asynchronous storing of data based on logged in user
    const storeData = async () => {
        try {
            await AsyncStorage.setItem(
                `$topics`,
                JSON.stringify(topics)
            );
        } catch (error) {
            console.log(error);
        }
    };

    //asynchronous loading of data based on logged in user
    const getData = async () => {
        try {
            const result = await AsyncStorage.getItem(`topics`);
            if (result !== null) {
                setTopics([...JSON.parse(result)]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    //Removing data stored for that flashcard
    const removeItem = async (index, item) => {
        try {
            await AsyncStorage.removeItem(
                `${item} + ${index} + answers`
            );
            await AsyncStorage.removeItem(
                `${item} + ${index} + questions`
            );
        } catch (error) {
            console.log(error);
        }
    };

    function handleTopic() {
        Keyboard.dismiss();
        setModalVisible(false);
        //Checks if the input field is empty, if true it does nothing
        //Else it adds the tasks to the array as normal
        if (!topic) {
            return;
        } else {
            setTopics([...topics, topic]);
            setTopic(null);
        }
    }

    function handleEditTopic() {
        Keyboard.dismiss();
        setModalVisible2(false);
        //Checks if the input field is empty, if true it does nothing
        //Else it adds the tasks to the array as normal
        if (!editTopic) {
            return;
        } else {
            topics[index] = editTopic;
            setEditTopic(null);
        }
    }

    //Deletes list items
    function deleteFlashCard(index, item) {
        let itemsCopy = [...topics];
        itemsCopy.splice(index, 1);
        removeItem(index, item);
        setTopics(itemsCopy);
    }

    //Storing async data
    useEffect(() => {
        storeData();
    });

    //Loads stored data on start up only
    const [appLoaded, setAppLoaded] = useState(false);

    //Local
    if (!appLoaded) {
        return (
            <AppLoading
                startAsync={getData}
                onFinish={() => setAppLoaded(true)}
                onError={(err) => console.log(err)}
            />
        );
    }

    return (
        <View style={styles.card}>
            <View style={styles.grid}>
                <Text style={styles.topic}>
                    Topics
                </Text>

                {/* Edit task modal*/}
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
                                    placeholder="Edit topic"
                                    onChangeText={(text) => setEditTopic(text)}
                                    value={editTopic}
                                    editable={true}
                                />
                                <View
                                    style={{
                                        width: 70,
                                        margin: 10,
                                        alignSelf: "center",
                                        paddingBottom: 10,
                                    }}
                                >
                                    <ButtonComponent
                                        title="Save"
                                        doSomething={() => handleEditTopic()}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Add card modal */}
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
                                    placeholder={"Name"}
                                    value={topic}
                                    onChangeText={(text) => setTopic(text)}
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
                                        doSomething={() => handleTopic()}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                <FlatList
                    data={topics}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(itemData) => {
                        return (
                            <View style={styles.container}>

                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate("Cards", {
                                            itemId: itemData.index,
                                            topic: itemData.item,
                                        })
                                    }
                                >
                                    <Text style={styles.content}>{itemData.item}</Text>
                                </TouchableOpacity>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-evenly",

                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setModalVisible2(true);
                                            setIndex(itemData.index);
                                        }}
                                    >
                                        <Ionicons
                                            name="pencil"
                                            color={colors.secondaryColor}
                                            size={25}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            deleteFlashCard(itemData.index, itemData.item);
                                        }}
                                    >
                                        <Ionicons name="trash-bin" color={colors.red} size={25} />
                                    </TouchableOpacity>
                                </View>


                            </View>
                        );
                    }}
                />
            </View>



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
    grid: {
        margin: 15,
        maxHeight: "85%",
    },
    card: {
        flex: 1,
        backgroundColor: "white",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.26,
        elevation: 5,
        backgroundColor: "#f0f8ff"
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
        height: 100,
        marginBottom: 15,
    },
    changeText: {
        alignItems: "center",
    },
    input: {
        paddingTop: 5,
        paddingHorizontal: 15,
        backgroundColor: "#FFF",
        borderRadius: 60,
        width: 250,
        borderColor: colors.primaryColor,
        color: "black",
        textAlign: "center",
        justifyContent: "center"
    },
    content: {
        textAlign: "center",
        fontFamily: "open-sans-bold",
        fontSize: 30,
        color: colors.primaryColor
    },
    topic: {
        fontFamily: "open-sans-bold",
        fontSize: 24,
        margin: 10,
        padding: 8,
        color: "#fff",
        backgroundColor: colors.primaryColor,
        borderRadius: 10,
        textAlign: "center",
    }
});

export default FlashCards;
