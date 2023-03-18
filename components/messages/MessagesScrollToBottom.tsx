import React from "react";

import { TouchableOpacity } from "react-native";

import { Icon } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

import { useTheme } from "../../hooks";

interface Props {
   isVisible: boolean;
   handleScroll: () => void;
}

export const MessagesScrollToBottom: React.FC<Props> = React.memo(({ isVisible, handleScroll }) => {
   const tw = useTailwind();

   const { THEME_MAIN } = useTheme();
   if (isVisible) {
      return (
         <TouchableOpacity
            onPress={handleScroll}
            style={tw(
               "bg-white w-16 h-16 flex items-center justify-center rounded-full absolute right-5 bottom-20 z-10",
            )}
         >
            <Icon name="keyboard-arrow-down" type="material" color={THEME_MAIN} size={40} />
         </TouchableOpacity>
      );
   }
   return null;
});
