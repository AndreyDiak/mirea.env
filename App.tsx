import { Roboto_500Medium, useFonts } from "@expo-google-fonts/roboto";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Provider } from "react-redux";
import { TailwindProvider } from "tailwind-rn";
import { Loader } from "./components";
import RootNavigator from "./navigator/RootNavigator";
import { store } from "./store";
import utilities from "./tailwind.json";

export default function App() {
  const [fontsLoadedRoboto] = [
    useFonts({
      Roboto_500Medium,
    }),
  ];

  if (!fontsLoadedRoboto) {
    return <Loader text={"Инициализация шрифтов"} />;
  }

  return (
    //@ts-ignore TaiwindProvider Type Defenition...
    <TailwindProvider utilities={utilities}>
      {/* <ToastProvider> */}
      <NavigationContainer>
        <Provider store={store}>
          <RootNavigator />
        </Provider>
      </NavigationContainer>
      {/* </ToastProvider> */}
    </TailwindProvider>
  );
}
