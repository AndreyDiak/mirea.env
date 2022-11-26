import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";

type Props = {
  step: AuthSteps;
  children: JSX.Element;
  handleSubmit: () => void;
  error: string;
};


const LoginForm = ({ step, children, handleSubmit, error }: Props) => {
  const tw = useTailwind();
  const navigation = useNavigation<LoginScreenNavigatorProp>();

  return (
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
      <View style={tw("py-2")}>
        {/* Title */}
        <Text
          style={[
            tw("text-center text-2xl text-gray-600 py-4"),
            {
              fontFamily: "Roboto_300Light",
            },
          ]}
        >
          {step === "auth" ? "Авторизация" : "Регистрация"}
        </Text>
        {error !== "" && (
          <Text style={tw("text-red-400 text-center")}>{error}</Text>
        )}
        {/* Login + Pass */}
        {children}

        <TouchableOpacity
          style={tw("flex flex-row justify-center pt-2")}
          onPress={handleSubmit}
        >
          <Text
            style={tw(
              "bg-blue-500 rounded-xl py-2 px-8 text-white font-bold text-2xl"
            )}
          >
            {step === "auth"
              ? "Войти"
              : step === "info"
              ? "Продолжить"
              : "Регистрация"}
          </Text>
        </TouchableOpacity>
        <View style={tw("flex flex-row justify-center mt-4")}>
          <Text style={tw("text-gray-400 mr-2")}>
            {step === "auth" ? "Нет аккаунта?" : "Есть аккаунт?"}
          </Text>
          <TouchableOpacity
            onPress={() =>
              step === "auth"
                ? navigation.navigate("AuthInfo")
                : navigation.navigate("Login")
            }
          >
            <Text style={tw("text-blue-400 underline")}>
              {step === "auth" ? "Регистрация" : "Авторизация"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginForm;
