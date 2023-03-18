import React from "react";

import { TouchableOpacity, View } from "react-native";

import { updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUserAppTheme, selectUserId } from "../../features/userSlice";
import { APP_THEME, DB_PATHS } from "../../typings/enums";
import { DOCS, returnAppTheme, returnAppThemeForBorder, returnAppThemeSecondary } from "../../utils";
import { ColorBlock } from "../common/ColorBlock";

export const ProfileMainTheme: React.FC = React.memo(() => {
   const tw = useTailwind();

   const userId = useSelector(selectUserId);
   const userAppTheme = useSelector(selectUserAppTheme);

   const setAppTheme = async (theme: APP_THEME) => {
      await updateDoc(DOCS.CREATE_DOC(DB_PATHS.USERS, userId), {
         appTheme: theme,
      });
   };

   return (
      <View>
         <View style={tw("flex flex-row justify-center -mr-4")}>
            <TouchableOpacity onPress={() => setAppTheme(APP_THEME.LIGHT)}>
               <ColorBlock
                  mainColor={returnAppTheme(APP_THEME.LIGHT)}
                  secondColor={returnAppThemeForBorder(APP_THEME.LIGHT)}
                  isBordered={userAppTheme === APP_THEME.LIGHT}
               />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAppTheme(APP_THEME.DARK)}>
               <ColorBlock
                  mainColor={returnAppTheme(APP_THEME.DARK)}
                  secondColor={returnAppThemeSecondary(APP_THEME.DARK)}
                  isBordered={userAppTheme === APP_THEME.DARK}
               />
            </TouchableOpacity>
         </View>
      </View>
   );
});
