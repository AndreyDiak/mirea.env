import React from "react";

import { ToastAndroid, TouchableOpacity } from "react-native";

import { doc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

import { selectUserId, selectUserTheme } from "../../features/slices/userSlice";
import { db } from "../../firebase";
import { USER_THEME } from "../../typings";
import { returnDarkenHexCode, returnHexCode } from "../../utils";
import { ColorBlock } from "./ColorBlock";

type Props = {
   theme: USER_THEME;
   isBordered: boolean;
};

export const ThemeCard: React.FC<Props> = React.memo(({ theme, isBordered }) => {
   const userId = useSelector(selectUserId);
   const userTheme = useSelector(selectUserTheme);

   const setUserTheme = async () => {
      await updateDoc(doc(db, `users/${userId}`), {
         theme,
      });
      ToastAndroid.show("Тема обновлена", 1000);
   };

   return (
      <TouchableOpacity onPress={setUserTheme}>
         <ColorBlock
            mainColor={returnHexCode(theme)}
            secondColor={returnDarkenHexCode(theme)}
            isBordered={userTheme === theme && isBordered}
         />
      </TouchableOpacity>
   );
});
