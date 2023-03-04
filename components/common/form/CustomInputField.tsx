import React from "react";

import { TextInput, TouchableOpacity, View } from "react-native";

import { Icon } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUserTheme } from "../../../features/userSlice";
import { returnHexCode } from "../../../utils";

interface Props {
   value: string;
   loading: boolean;
   placeholder?: string;
   ref?: React.MutableRefObject<any>;
   setValue: (value: string) => void;
   onSubmit: () => void;
   onFocus?: () => void;
}

export const CustomInputField: React.FC<Props> = React.memo(
   ({ value, loading, ref, placeholder, setValue, onSubmit, onFocus }) => {
      const tw = useTailwind();
      const theme = useSelector(selectUserTheme);

      return (
         <View style={tw("flex flex-row items-center absolute bottom-0")}>
            {/* Reply message or Reply Post from discipline... */}
            <TextInput
               ref={ref}
               onFocus={onFocus}
               style={tw("bg-white flex-1 mr-4 p-3 h-12 text-[18px]")}
               placeholder={placeholder ?? "Введите текст..."}
               value={value}
               onChangeText={setValue}
            />
            <TouchableOpacity disabled={loading} onPress={onSubmit} style={tw("pr-2")}>
               <Icon
                  name="send"
                  type="material"
                  color={!loading ? returnHexCode(theme) : "#9ca3af"}
                  size={30}
               />
            </TouchableOpacity>
         </View>
      );
   },
);
