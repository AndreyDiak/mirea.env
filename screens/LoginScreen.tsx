import React, { useState } from "react";

import { View } from "react-native";

import { Input } from "@rneui/base";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useTailwind } from "tailwind-rn/dist";

import { LoginForm } from "../components";
import { auth } from "../firebase";
import { AUTH_STEPS } from "../typings";

export function LoginScreen() {
   const tw = useTailwind();

   const [login, setLogin] = useState<string>("");
   const [password, setPassword] = useState<string>("");
   // const [isStudent, setIsStudent] = useState<boolean>(true);
   const [error, setError] = useState("");
   const signIn = async () => {
      await signInWithEmailAndPassword(auth, login.toLowerCase(), password)
         .then()
         .catch(() => setError("Неверный логин или пароль"));
   };

   return (
      <View style={tw("w-full h-full bg-slate-100 flex flex-row items-center justify-center")}>
         <LoginForm step={AUTH_STEPS.AUTH} handleSubmit={signIn} error={error}>
            <View style={tw("")}>
               <Input placeholder="Почта..." value={login} onChangeText={setLogin} containerStyle={tw(``)} />
               <Input
                  placeholder="Пароль..."
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  containerStyle={tw(``)}
               />
            </View>
         </LoginForm>
      </View>
   );
}
