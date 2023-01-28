import { useNavigation } from "@react-navigation/native";
import { Input } from "@rneui/themed";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { LoginForm } from "../components";
import { db } from "../firebase";

export const AuthInfoScreen = () => {
  const tw = useTailwind();
  const navigation = useNavigation<AuthInfoScreenNavigatorProp>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [secondPassword, setSecondPassword] = useState<string>("");
  const [error, setError] = useState("");
  // const [isStudent, setIsStudent] = useState<boolean>(true);

  const register = async () => {
    // creating a query to DB

    if (email == "") {
      setError("Введите почту");
      return;
    }

    const q = query(
      collection(db, "users"),
      where("email", "==", email.toLowerCase())
    );
    // getting snapshot from DB
    const querySnap = await getDocs(q);
    // if email already exist...
    if (querySnap.docs.length !== 0) {
      setError("Такой пользователь уже существует");
      return;
    }
    // password checking...
    if (password === secondPassword) {
      if (password.length < 6) {
        setError("Пароль должен содержать минимум 6 символов...");
        return;
      }
      navigation.navigate("AuthBio", {
        email,
        password,
      });
    } else {
      setError("Пароли не совпадают");
    }
  };

  return (
    <View
      style={tw(
        "w-full h-full bg-slate-100 flex flex-row items-center justify-center"
      )}
    >
      <LoginForm handleSubmit={register} step="info" error={error}>
        <View>
          <Input
            placeholder="Почта..."
            value={email}
            onChangeText={setEmail}
            containerStyle={tw("")}
          />
          <Input
            placeholder="Пароль..."
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            containerStyle={tw("")}
          />
          <Input
            placeholder="Повторите пароль..."
            value={secondPassword}
            onChangeText={setSecondPassword}
            secureTextEntry
            containerStyle={tw("")}
          />
        </View>
      </LoginForm>
    </View>
  );
};
