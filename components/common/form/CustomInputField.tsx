import React from "react";

import { TextInput, TouchableOpacity, View } from "react-native";

import { Icon } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUserTheme } from "../../../features/userSlice";
import { returnHexCode } from "../../../utils";

interface Props {
   value: string;
   setValue: (value: string) => void;
   onSubmit: () => void;
   onFocus?: () => void;
}

export const CustomInputField: React.FC<Props> = React.memo(({ value, setValue, onSubmit, onFocus }) => {
   const tw = useTailwind();
   const theme = useSelector(selectUserTheme);
   return (
      <View style={tw("flex flex-row items-center")}>
         {/* Reply message or Reply Post from discipline... */}
         <TextInput
            ref={messageRef}
            onFocus={() => setIsScrollToBottomVisible(false)}
            style={tw("bg-white flex-1 mr-4 p-3 h-12 text-[18px]")}
            placeholder="Введите текст..."
            value={value}
            onChangeText={setValue}
         />
         <TouchableOpacity disabled={loading} onPress={onSubmit} style={tw("pr-2")}>
            <Icon name="send" type="material" color={!loading ? returnHexCode(theme) : "#9ca3af"} size={30} />
         </TouchableOpacity>
      </View>
   );
});
