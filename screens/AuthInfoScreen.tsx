import React, { useState } from "react";

import { View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Input } from "@rneui/themed";
import { useDispatch } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { LoginForm } from "../components";
import { setEmail, setPassword } from "../features/slices/authSlice";
import { AUTH_STEPS, AuthInfoScreenNavigationProp } from "../typings";

interface UserData {
   email: string;
   password: string;
   repeatedPassword: string;
}

export function AuthInfoScreen() {
   const tw = useTailwind();
   const navigation = useNavigation<AuthInfoScreenNavigationProp>();
   const [userData, setUserData] = useState<UserData>(null);

   const dispatch = useDispatch();

   const [error, setError] = useState("");

   const checkEmailAndPassword = async () => {
      // check email
      if (userData?.email === "") {
         setError("Введите почту");
         return;
      }
      // check password length
      if (userData?.password.length < 6) {
         setError("Пароль должен содержать минимум 6 символов...");
         return;
      }
      // check repeat password
      if (userData?.password !== userData?.repeatedPassword) {
         setError("Пароли не совпадают");
         return;
      }

      dispatch(setEmail({ email: userData.email.toLowerCase() }));
      dispatch(setPassword({ password: userData.password }));

      navigation.navigate("AuthBio");
   };

   return (
      <View style={tw("w-full h-full bg-slate-100 flex flex-row items-center justify-center")}>
         <LoginForm handleSubmit={checkEmailAndPassword} step={AUTH_STEPS.INFO} error={error}>
            <View>
               <Input
                  placeholder="Почта..."
                  value={userData?.email}
                  onChangeText={(value) => {
                     setUserData({ ...userData, email: value });
                  }}
               />
               <Input
                  placeholder="Пароль..."
                  secureTextEntry
                  value={userData?.password}
                  onChangeText={(value) => {
                     setUserData({ ...userData, password: value });
                  }}
               />
               <Input
                  placeholder="Повторите пароль..."
                  secureTextEntry
                  value={userData?.repeatedPassword}
                  onChangeText={(value) => {
                     setUserData({ ...userData, repeatedPassword: value });
                  }}
               />
            </View>
         </LoginForm>
      </View>
   );
}
