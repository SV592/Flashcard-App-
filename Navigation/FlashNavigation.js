import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//Customer Screen Imports
import FlashCard from "../Screens/Flashcard";
import Cards from "../Screens/Cards";
import colors from "../Constants/colors";

const Stack = createStackNavigator();

function myStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="FlashCards" component={FlashCard} options={{
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: colors.primaryColor,
          }
        }} />
        <Stack.Screen name="Cards" component={Cards} options={{
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: colors.primaryColor,
          }
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default myStack;
