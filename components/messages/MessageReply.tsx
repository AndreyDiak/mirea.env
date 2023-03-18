import React, { useMemo } from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUserTheme } from "../../features/userSlice";
import { DBMessage } from "../../typings";
import { APP_THEME } from "../../typings/enums";
import { COLORS_COMMON, COLORS_THEME_SECONDARY, returnAppThemeText, returnDarkestHexCode } from "../../utils";

interface Props {
   reply: DBMessage | null;
   messageEmail: string;
   email: string;
   appTheme: APP_THEME;
   setBackligthMessage: () => void;
}

export const MessageReply: React.FC<Props> = React.memo(
   ({ reply, email, messageEmail, setBackligthMessage, appTheme }) => {
      const tw = useTailwind();
      const theme = useSelector(selectUserTheme);

      const isMyMessage = useMemo(() => messageEmail === email, [email, messageEmail]);

      if (reply !== null) {
         return (
            <TouchableOpacity style={tw("mb-1")} onPress={setBackligthMessage}>
               <View style={tw("flex flex-row pt-1")}>
                  <View
                     style={{
                        marginRight: 7,
                        height: "100%",
                        width: 2,
                        backgroundColor: returnDarkestHexCode(theme),
                     }}
                  />
                  <View>
                     <Text
                        style={{
                           fontWeight: "800",
                           color: isMyMessage ? returnAppThemeText(appTheme) : COLORS_THEME_SECONDARY.LIGHT,
                        }}
                     >
                        {reply.displayName}
                     </Text>
                     <Text
                        style={{
                           color: isMyMessage ? COLORS_COMMON.DISABLED : "#e5e7eb",
                        }}
                     >
                        {reply.text}
                     </Text>
                  </View>
               </View>
            </TouchableOpacity>
         );
      }

      return null;
   },
);
