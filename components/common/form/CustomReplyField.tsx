import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { Icon } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

import { useTheme } from "../../../hooks";
import { Message } from "../../../typings";
import { COLORS_COMMON } from "../../../utils";

interface Props {
   isReplying: boolean;
   replyMessage: Message | null;
   replyHandler: () => void;
}

export const CustomReplyField: React.FC<Props> = React.memo(({ isReplying, replyHandler, replyMessage }) => {
   const tw = useTailwind();

   const { APP_THEME_TEXT, APP_THEME_SECONDARY, THEME_MAIN } = useTheme();

   return isReplying ? (
      <View
         style={[
            tw("flex flex-row items-center justify-between px-4 py-2 border-b border-gray-200"),
            {
               backgroundColor: APP_THEME_SECONDARY,
            },
         ]}
      >
         <Icon name="redo" type="material" size={30} color={THEME_MAIN} />
         <View style={tw("w-0.5 h-full bg-gray-400 ml-4")} />
         <View style={tw("flex-1 pl-4")}>
            <Text
               style={[
                  tw("font-semibold"),
                  {
                     color: APP_THEME_TEXT,
                  },
               ]}
            >
               {replyMessage?.displayName}
            </Text>
            <Text style={tw("text-gray-400")}>{replyMessage?.text}</Text>
         </View>
         <TouchableOpacity onPress={replyHandler}>
            <Icon name="close" type="material" size={30} color={COLORS_COMMON.DISABLED} />
         </TouchableOpacity>
      </View>
   ) : null;
});
