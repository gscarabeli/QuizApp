import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./screens/Home";
import Themes from "./screens/Themes";
import Questions from "./screens/Questions";
import Quiz from "./screens/Quiz";
import EndGame from "./screens/EndGame";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerBackVisible: true,
            headerShown: false,
            headerTitle: false,
            headerStyle: { backgroundColor: "transparent" },
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="Themes"
          component={Themes}
          options={{
            headerBackVisible: true,
            headerShown: false,
            headerTitle: false,
            headerStyle: { backgroundColor: "transparent" },
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="Questions"
          component={Questions}
          options={{
            headerBackVisible: true,
            headerShown: false,
            headerTitle: false,
            headerStyle: { backgroundColor: "transparent" },
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="Quiz"
          component={Quiz}
          options={{
            headerBackVisible: true,
            headerShown: false,
            headerTitle: false,
            headerStyle: { backgroundColor: "transparent" },
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="EndGame"
          component={EndGame}
          options={{
            headerBackVisible: true,
            headerShown: false,
            headerTitle: false,
            headerStyle: { backgroundColor: "transparent" },
            animation: "fade",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
