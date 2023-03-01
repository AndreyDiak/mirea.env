import React from "react";

import { ToastAndroid, TouchableOpacity, View } from "react-native";

import { doc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUser } from "../features/userSlice";
import { db } from "../firebase";
import type { AppTheme } from "../typings";
import { returnDarkenHexCode, returnHexCode } from "../utils";

type Props = {
   theme: AppTheme;
   isBordered: boolean;
};

export const ThemeCard: React.FC<Props> = React.memo(({ theme, isBordered }) => {
   const tw = useTailwind();
   const user = useSelector(selectUser);

   const setUserTheme = async () => {
      await updateDoc(doc(db, `users/${user?.id}`), {
         theme,
      });
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
                     user?.theme === theme && isBordered
                        ? returnDarkenHexCode(theme)
                        : "transparent",
               },
            ]}
         />
      </TouchableOpacity>
   );
});
