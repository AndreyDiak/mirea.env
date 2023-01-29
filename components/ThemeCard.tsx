import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import { ToastAndroid, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import { getUser, setTheme } from "../features/userSlice";
import { db } from "../firebase";
import { returnDarkenHexCode, returnHexCode } from "../utils/returnHexCodes";

type Props = {
  theme: AppTheme;
  isBordered: boolean;
};

export const ThemeCard: React.FC<Props> = React.memo(({ theme, isBordered }) => {
  const tw = useTailwind();
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  const setUserTheme = async () => {
    await updateDoc(doc(db, `users/${user?.userId}`), {
      theme,
    });
    dispatch(setTheme(theme));
    ToastAndroid.show("Тема обновлена", 1000);
  };

  return (
    <TouchableOpacity onPress={setUserTheme}>
      <View
        style={[
          tw("w-12 h-8 rounded-md mr-4"),
          {
            backgroundColor: returnHexCode(theme),
            borderWidth: 2,
            borderStyle: "solid",
            borderColor:
              user?.theme === theme && isBordered ? returnDarkenHexCode(theme) : "transparent",
          },
        ]}
      />
    </TouchableOpacity>
  );
});
