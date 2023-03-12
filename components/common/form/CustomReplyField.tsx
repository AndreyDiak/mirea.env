import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { Icon } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUserTheme } from "../../../features/userSlice";
import { DBMessage } from "../../../typings";
import { returnHexCode } from "../../../utils";

interface Props {
   isReplying: boolean;
   replyMessage: DBMessage | null;
   replyHandler: () => void;
}

export const CustomReplyField: React.FC<Props> = React.memo(({ isReplying, replyHandler, replyMessage }) => {
   const tw = useTailwind();
   const theme = useSelector(selectUserTheme);

   return isReplying ? (
      <View
         style={tw("flex flex-row items-center justify-between bg-white px-4 py-2 border-b border-gray-200")}
      >
         <Icon name="redo" type="material" size={30} color={returnHexCode(theme)} />
         <View style={tw("w-0.5 h-full bg-gray-400 ml-4")} />
         <View style={tw("flex-1 pl-4")}>
            <Text style={tw("font-semibold")}>{replyMessage?.displayName}</Text>
            <Text style={tw("text-gray-400")}>{replyMessage?.text}</Text>
         </View>
         <TouchableOpacity onPress={replyHandler}>
            <Icon name="close" type="material" size={30} color="#374151" />
         </TouchableOpacity>
      </View>
   ) : null;
});
