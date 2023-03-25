/* eslint-disable camelcase */
import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { TailwindProvider } from "tailwind-rn";

import { GlobalModal } from "./components/common/modal/GlobalModal";
import RootNavigator from "./navigator/RootNavigator";
import { store } from "./store";
// eslint-disable-next-line import/extensions
import utilities from "./tailwind.json";

export default function App() {
   return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TaiwindProvider Type Defenition...
      <TailwindProvider utilities={utilities}>
         <Provider store={store}>
            <NavigationContainer>
               <GlobalModal>
                  <RootNavigator />
               </GlobalModal>
            </NavigationContainer>
         </Provider>
      </TailwindProvider>
   );
}
