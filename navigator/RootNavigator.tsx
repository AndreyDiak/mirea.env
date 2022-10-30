import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setNotifications, setUser } from "../features/userSlice";
import { auth, db } from "../firebase";
import AuthBioScreen from "../screens/AuthBioScreen";
import AuthInfoScreen from "../screens/AuthInfoScreen";
import ChatScreen from "../screens/ChatScreen";
import ChatsScreen from "../screens/ChatsScreen";
import CommentsScreen from "../screens/CommentsScreen";
import DisciplineScreen from "../screens/DisciplineScreen";
import LoginScreen from "../screens/LoginScreen";
import TabNavigator from "./TabNavigator";

type Props = {
  user: any;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  // user которого мы получаем от сервиса авторизации...
  const [initialUser, setInitialUser] = useState<any>(null);

  const dispatch = useDispatch();

  // авторизация с сервиса...
  onAuthStateChanged(auth, async (resolve) => {
    if (resolve) {
      setInitialUser(resolve);
    } else {
      setInitialUser(null);
    }
  });

  // if (initialUser) {
  //   const notificationsQuery = query(
  //     collection(db, "notifications"),
  //     where("userEmail", "==", initialUser.email),
  //     where("isChecked", "==", false)
  //   );

  //   const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
  //     let notifications: any = [];

  //     notifications = snapshot.docs.map((doc) => ({
  //       ...doc.data(),
  //       notificationId: doc.id,
  //     }));
  //     dispatch(setNotifications(notifications));
  //   });
  // }

  //на основе данных с сервиса получаем данные с БД
  useEffect(() => {
    const getUser = async () => {
      if (initialUser) {
        const q = query(
          collection(db, "users"),
          where("email", "==", initialUser.email)
        );
        const querySnap = await getDocs(q);
        // Teacher | Student type...
        const user: any = {
          ...querySnap.docs[0].data(),
          userId: querySnap.docs[0].id,
        };
        dispatch(setUser(user));
      } else {
        dispatch(setUser(null));
        dispatch(setNotifications([]));
      }
    };
    getUser();
  }, [initialUser]);

  return !initialUser ? (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
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
        <Stack.Screen
          name="Main"
          options={{ headerShown: false }}
          component={TabNavigator}
        />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="Discipline" component={DisciplineScreen} />
        <Stack.Screen name='Comments' component={CommentsScreen} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="Chats" component={ChatsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RootNavigator;
