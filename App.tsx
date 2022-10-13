import { Inter_900Black, useFonts as useFontsInter } from "@expo-google-fonts/inter";
import {
  Roboto_300Light, Roboto_400Regular, Roboto_500Medium, useFonts as UseFontsRoboto
} from "@expo-google-fonts/roboto";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { Provider } from "react-redux";
import { TailwindProvider } from "tailwind-rn";
import { auth } from "./firebase";
import RootNavigator from "./navigator/RootNavigator";
import { store } from "./store";
import utilities from "./tailwind.json";

export default function App() {

  const [user, setUser] = useState<User | null>(null)

  onAuthStateChanged(auth, user => {
    if(user) {
      setUser(user)
      // dispatch(setUser(user))
    } else {
      setUser(null)
      // dispatch(setUser(null))
    }
  })

  let [fontsLoadedInter, fontsLoadedRoboto] = [
    useFontsInter({
      Inter_900Black,
    }),
    UseFontsRoboto({
      Roboto_400Regular,
      Roboto_500Medium,
      Roboto_300Light
    }),
  ];

  if (!fontsLoadedInter || !fontsLoadedRoboto) {
    return null;
  }

  return (
    //@ts-ignore TaiwindProvider Type Defenition...
    <TailwindProvider utilities={utilities}>
      <NavigationContainer>
        <Provider store={store}>
          <RootNavigator isAuth={!!user} />
        </Provider>
      </NavigationContainer>
    </TailwindProvider>
  );
}