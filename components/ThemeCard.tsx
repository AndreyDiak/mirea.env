import { View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setTheme } from "../features/userSlice";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

type Props = {
  theme: AppTheme;
  isBordered: boolean;
};

const ThemeCard = ({ theme, isBordered }: Props) => {
  const tw = useTailwind();
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  console.log(user?.theme);

  const setUserTheme = async () => {
    await updateDoc(doc(db, `users/${user?.userId}`), {
      theme,
    });
    dispatch(setTheme(theme));
    ToastAndroid.show("Тема обновлена", 1000);
  };

  return (
    <TouchableOpacity
      onPress={setUserTheme}
    >
      <View
        style={tw(
          `w-12 h-8 bg-${theme}-400 rounded-md mr-4 ${
            user?.theme === theme && isBordered ? `border-2 border-${theme}-600` : ""
          }`
        )}
      />
    </TouchableOpacity>
  );
};

export default ThemeCard;
