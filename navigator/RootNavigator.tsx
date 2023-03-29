import React, { useState } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";

import { selectUser, setUser } from "../features/slices/userSlice";
import { auth } from "../firebase";
import { useUser } from "../hooks";
import {
   AdminScreen,
   AuthBioScreen,
   AuthInfoScreen,
   ChatScreen,
   ChatsScreen,
   CommentsScreen,
   DisciplineScreen,
   LoginScreen,
} from "../screens";
import { RootStackParamList } from "../typings";
import { USER_TYPE } from "../typings/enums";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
   // user которого мы получаем от сервиса авторизации...
   const [initialUser, setInitialUser] = useState(null);
   const dispatch = useDispatch();
   const user = useSelector(selectUser);

   // авторизация с сервиса...
   onAuthStateChanged(auth, async (resolve) => {
      if (resolve) {
         setInitialUser(resolve);
      } else {
         setInitialUser(null);
         dispatch(setUser(null));
      }
   });

   useUser(initialUser);

   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
   // @ts-ignore
   if (user && user.type === USER_TYPE.ADMIN) {
      return <AdminScreen />;
   }

   return !user ? (
      <Stack.Navigator>
         <Stack.Group>
            <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
            <Stack.Screen
               options={{
                  headerShown: false,
                  presentation: "modal",
               }}
               name="AuthInfo"
               component={AuthInfoScreen}
            />
            <Stack.Screen
               options={{
                  headerShown: false,
                  presentation: "modal",
               }}
               name="AuthBio"
               component={AuthBioScreen}
            />
         </Stack.Group>
      </Stack.Navigator>
   ) : (
      <Stack.Navigator>
         <Stack.Group>
            <Stack.Screen name="Main" options={{ headerShown: false }} component={TabNavigator} />
         </Stack.Group>
         <Stack.Group>
            <Stack.Screen name="Discipline" component={DisciplineScreen} />
            <Stack.Screen name="Comments" component={CommentsScreen} />
         </Stack.Group>
         <Stack.Group>
            <Stack.Screen name="Chats" component={ChatsScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
         </Stack.Group>
      </Stack.Navigator>
   );
}

export default RootNavigator;
