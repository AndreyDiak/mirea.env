import React, { useEffect, useRef } from "react";

import { TextInput, TouchableOpacity, View } from "react-native";

import { Icon } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUserAppTheme, selectUserTheme } from "../../../features/userSlice";
import { DBMessage } from "../../../typings";
import { returnAppThemeSecondary, returnAppThemeText, returnHexCode } from "../../../utils";
import { CustomReplyField } from "./CustomReplyField";

interface Props {
   value: string;
   loading: boolean;
   placeholder?: string;
   isReplying?: boolean;
   replyData?: {
      replyMessage: DBMessage | null;
      replyHandler: () => void;
   };
   setValue: (value: string) => void;
   onSubmit: () => void;
   onFocus?: () => void;
}

export const CustomInputField: React.FC<Props> = React.memo(
   ({ value, loading, isReplying, replyData, placeholder, setValue, onSubmit, onFocus }) => {
      const tw = useTailwind();
      const theme = useSelector(selectUserTheme);
      const appTheme = useSelector(selectUserAppTheme);

      const ref = useRef(null);

      useEffect(() => {
         if (isReplying) {
            ref.current.focus();
         }
      }, [isReplying]);

      return (
         <View style={tw("absolute bottom-0 w-full")}>
            {/* Reply message or Reply Post from discipline... */}
            <CustomReplyField
               isReplying={isReplying}
               replyMessage={replyData?.replyMessage}
               replyHandler={replyData?.replyHandler}
            />
            <View
               style={[
                  tw("w-full flex flex-row items-center"),
                  {
                     backgroundColor: returnAppThemeSecondary(appTheme),
                  },
               ]}
            >
               <TextInput
                  ref={ref}
                  onFocus={onFocus}
                  style={[
                     tw("flex-1 mr-4 p-3 h-12 text-[18px]"),
                     {
                        color: returnAppThemeText(appTheme),
                     },
                  ]}
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
         </View>
      );
   },
);
