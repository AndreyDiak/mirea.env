import { Input } from "@rneui/base";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import LoginForm from "../components/LoginForm";
import { auth } from "../firebase";

type Props = {};

const LoginScreen = (props: Props) => {
  const tw = useTailwind();

  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const [isStudent, setIsStudent] = useState<boolean>(true);
  const [error, setError] = useState("");
  const signIn = async () => {
    await signInWithEmailAndPassword(auth, login.toLowerCase(), password)
      .then()
      .catch((err) => setError("Неверный логин или пароль"));
  };

  return (
    <View
      style={tw(
        "w-full h-full bg-slate-100 flex flex-row items-center justify-center"
      )}
    >
      <LoginForm step="auth" handleSubmit={signIn} error={error}>
        <View style={tw("")}>
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
        </View>
      </LoginForm>
    </View>
  );
};

export default LoginScreen;
