import { Inter_900Black, useFonts as useFontsInter } from "@expo-google-fonts/inter";
import {
  Roboto_300Light, Roboto_400Regular, Roboto_500Medium, useFonts as UseFontsRoboto
} from "@expo-google-fonts/roboto";
import { NavigationContainer } from "@react-navigation/native";
import { Provider, useDispatch } from "react-redux";
import { TailwindProvider } from "tailwind-rn";
import RootNavigator from "./navigator/RootNavigator";
import { store } from "./store";
import utilities from "./tailwind.json";
import {useState} from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { setUser } from "./features/userSlice";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function App() {

  const [user, setUser] = useState<any>(null)
  
  onAuthStateChanged(auth, async (resolve) => {
    if(resolve) {
      setUser(resolve)
    } else {
      setUser(null);
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

  

  if (!fontsLoadedInter && !fontsLoadedRoboto) {
    return null;
  }

  return (
    //@ts-ignore TaiwindProvider Type Defenition...
    <TailwindProvider utilities={utilities}>
      <NavigationContainer>
        <Provider store={store}>
          <RootNavigator user={user}/>
        </Provider>
      </NavigationContainer>
    </TailwindProvider>
  );
}