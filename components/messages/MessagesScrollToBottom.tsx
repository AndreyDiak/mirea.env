import { Icon } from "@rneui/themed";
import React from "react";

import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import { selectUserTheme } from "../../features/userSlice";
import { returnHexCode } from "../../utils";

interface Props {
  isVisible: boolean;
  handleScroll: () => void;
}

export const MessagesScrollToBottom: React.FC<Props> = React.memo(({ isVisible, handleScroll }) => {
  const tw = useTailwind();
  const theme = useSelector(selectUserTheme);
  if (isVisible) {
    return (
      <TouchableOpacity
        onPress={handleScroll}
        style={tw(
          "bg-white w-16 h-16 flex items-center justify-center rounded-full absolute right-5 bottom-20 z-10"
        )}
      >
        <Icon name="keyboard-arrow-down" type="material" color={returnHexCode(theme)} size={40} />
      </TouchableOpacity>
    );
  }
});
