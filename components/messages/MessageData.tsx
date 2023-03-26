import React, { useMemo } from "react";

import { Text, View } from "react-native";

import moment from "moment";
import { useTailwind } from "tailwind-rn/dist";

import { Message as MessageType } from "../../typings";
import { APP_THEME } from "../../typings/enums";
import { returnAppThemeText } from "../../utils";

interface Props {
   message: MessageType;
   email: string;
   appTheme: APP_THEME;
   isNextMessageOwner: boolean;
}

export const MessageData: React.FC<Props> = React.memo(({ message, email, isNextMessageOwner, appTheme }) => {
   const tw = useTailwind();

   const isMyMessage = useMemo(() => message.email === email, [message.email, email]);

   return (
      <>
         {/* Message Owner... */}
         {!isNextMessageOwner && (
            <Text
               style={tw(
                  `${isMyMessage ? "right-2 text-gray-400" : "left-2 text-gray-200"} absolute text-xs`,
               )}
            >
               {isMyMessage ? "Вы" : message.displayName}
            </Text>
         )}

         <View style={tw("flex flex-row items-end w-full")}>
            {/* Message Text... */}
            <Text
               style={{
                  fontSize: 14,
                  marginRight: 8,
                  fontWeight: "600",
                  color: isMyMessage ? returnAppThemeText(appTheme) : "#f3f4f6",
                  maxWidth: "85%",
               }}
            >
               {message.text}
            </Text>
            {/* Message Date... */}
            <Text
               style={[
                  tw(`text-xs -mb-1 ${!isMyMessage ? "text-right " : ""}`),
                  {
                     color: isMyMessage ? returnAppThemeText(appTheme) : "#f3f4f6",
                  },
               ]}
            >
               {message.timestamp ? moment(message.timestamp.toDate()).format("LT") : "..."}
            </Text>
         </View>
      </>
   );
});
