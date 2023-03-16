/* eslint-disable camelcase */
import React from "react";

import { Roboto_500Medium, useFonts } from "@expo-google-fonts/roboto";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { TailwindProvider } from "tailwind-rn";

import { Loader } from "./components";
import { GlobalModal } from "./components/common/modal/GlobalModal";
import RootNavigator from "./navigator/RootNavigator";
import { store } from "./store";
// eslint-disable-next-line import/extensions
import utilities from "./tailwind.json";

export default function App() {
   const [fontsLoadedRoboto] = [
      useFonts({
         Roboto_500Medium,
      }),
   ];

   if (!fontsLoadedRoboto) {
      return <Loader text="Инициализация шрифтов" />;
   }

   return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TaiwindProvider Type Defenition...
      <TailwindProvider utilities={utilities}>
         <Provider store={store}>
            <GlobalModal>
               <NavigationContainer>
                  <RootNavigator />
               </NavigationContainer>
            </GlobalModal>
         </Provider>
      </TailwindProvider>
   );
}
