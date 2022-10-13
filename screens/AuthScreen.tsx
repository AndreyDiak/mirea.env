import { useNavigation } from "@react-navigation/native";
import { CheckBox, Input } from "@rneui/base";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { auth } from "../firebase";

type Props = {};

const AuthScreen = (props: Props) => {
  const tw = useTailwind();

  const navigation = useNavigation();
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const [isLoading, setIsLoading] = useState(false);
  const [isStudent, setIsStudent] = useState<boolean>(true);

  const signIn = async () => {
    signInWithEmailAndPassword(auth, login, password)
      .then((user) => {
        console.log(user);
      })
      .catch((err) => console.log(err));
  };

  return (
    <View
      style={tw(
        "w-full h-full bg-slate-100 flex flex-row items-center justify-center"
      )}
    >
      <View style={tw("bg-white w-4/5 rounded-lg p-2")}>
        {/* Logo */}
        <Text
          style={[
            tw("text-blue-500 text-[44px] uppercase text-center"),
            {
              fontFamily: "Roboto_500Medium",
            },
          ]}
        >
          mirea.env
        </Text>
        {/* Form */}
        <View style={tw("my-6")}>
          {/* Title */}
          <Text
            style={[
              tw("text-center text-2xl text-gray-600 py-4"),
              {
                fontFamily: "Roboto_300Light",
              },
            ]}
          >
            Авторизация
          </Text>
          {/* Login + Pass */}
          <Input
            placeholder="Логин..."
            value={login}
            onChangeText={setLogin}
            containerStyle={tw("")}
          />
          <Input
            placeholder="Пароль..."
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            containerStyle={tw("")}
          />
          <CheckBox
            title={"Я студент"}
            checked={isStudent}
            onPress={() => setIsStudent(true)}
            size={20}
            textStyle={tw(`${isStudent ? "text-gray-600" : "text-gray-400"} `)}
          />
          <CheckBox
            title={"Я преподаватель"}
            checked={!isStudent}
            onPress={() => setIsStudent(false)}
            size={20}
            textStyle={tw(`${!isStudent ? "text-gray-600" : "text-gray-400"} `)}
          />
          <TouchableOpacity style={tw("flex flex-row justify-center pt-4")}>
            <Text
              style={tw(
                'bg-blue-500 rounded-xl py-2 px-6 text-white font-bold text-2xl'
              )}
              onPress={signIn}
            >
              Авторизация
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AuthScreen;
