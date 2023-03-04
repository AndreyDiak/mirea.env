import React, { useMemo } from "react";

import { Text, View } from "react-native";

import moment from "moment";
import { useTailwind } from "tailwind-rn/dist";

import { DBMessage } from "../../typings";

interface Props {
   message: DBMessage;
   email: string;
   isNextMessageOwner: boolean;
}

export const MessageData: React.FC<Props> = React.memo(({ message, email, isNextMessageOwner }) => {
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
                  color: isMyMessage ? "#1f2937" : "#f3f4f6",
                  maxWidth: "85%",
               }}
            >
               {message.text}
            </Text>
            {/* Message Date... */}
            <Text style={tw(`text-xs -mb-1 ${isMyMessage ? "text-gray-800" : "text-right text-gray-100"}`)}>
               {message.timestamp ? moment(message.timestamp.toDate()).format("LT") : "..."}
            </Text>
         </View>
      </>
   );
});
