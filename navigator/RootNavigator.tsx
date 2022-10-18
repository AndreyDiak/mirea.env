import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setUser } from "../features/userSlice";
import { auth, db } from "../firebase";
import AuthBioScreen from "../screens/AuthBioScreen";
import AuthInfoScreen from "../screens/AuthInfoScreen";
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

  const user = useSelector(getUser);
  const dispatch = useDispatch();

  // авторизация с сервиса...
  onAuthStateChanged(auth, async (resolve) => {
    if (resolve) {
      setInitialUser(resolve);
    } else {
      setInitialUser(null);
    }
  });
  // на основе данных с сервиса получаем данные с БД
  useEffect(() => {
    const getUser = async () => {
      if (initialUser) {
        const q = query(collection(db, "users"), where("email", "==", initialUser.email));
        const querySnap = await getDocs(q);
        // Teacher | Student type...
        const user: any = {
          ...querySnap.docs[0].data(),
          userId: querySnap.docs[0].id,
        };
        dispatch(setUser(user));
      } else {
        dispatch(setUser(null));
      }
    };
    getUser();
  }, [initialUser]);

  return !user ? (
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
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RootNavigator;
