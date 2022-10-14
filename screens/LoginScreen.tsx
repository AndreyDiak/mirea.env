import { Input } from "@rneui/base";
import { CheckBox } from "@rneui/themed";
import { registerVersion } from "firebase/app";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import LoginForm from "../components/LoginForm";
import { auth, db } from "../firebase";

type Props = {};

const LoginScreen = (props: Props) => {
  const tw = useTailwind();

  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isStudent, setIsStudent] = useState<boolean>(true);
  const [error, setError] = useState("");
  const signIn = async () => {
    await signInWithEmailAndPassword(auth, login, password).then(resolve => console.log(resolve))

    // const q = query(
    //   collection(db, `users/${isStudent ? "students" : "teachers"}/collection`),
    //   where("email", "==", login)
    // );
    // const querySnap = await getDocs(q);
    
    // if (querySnap.docs.length === 0 || querySnap.docs[0].data().password !== password) {
    //   setError("Неверный логин или пароль...");
    // } else {
    //   console.log('success')
    // }

  };

  return (
    <View
      style={tw(
        "w-full h-full bg-slate-100 flex flex-row items-center justify-center"
      )}
    >
      <LoginForm step="auth" handleSubmit={signIn}>
        <View style={tw("")}>
          <Text style={tw('text-red-400 text-center')}>{error}</Text>
          <Input
            placeholder="Почта..."
            value={login}
            onChangeText={setLogin}
            containerStyle={tw(``)}
          />
          <Input
            placeholder="Пароль..."
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            containerStyle={tw(``)}
          />
          <CheckBox
            title="Я студент"
            checked={isStudent}
            onPress={() => setIsStudent(true)}
            containerStyle={{ padding: 0 }}
          />
          <CheckBox
            title="Я преподаватель"
            checked={!isStudent}
            onPress={() => setIsStudent(false)}
            containerStyle={{ padding: 0 }}
          />
        </View>
      </LoginForm>
    </View>
  );
};

export default LoginScreen;
