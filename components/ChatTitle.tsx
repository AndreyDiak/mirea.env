import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";
import { Icon } from "@rneui/themed";
import * as Clipboard from 'expo-clipboard'

type Props = {
  message: Message;
  onClose: () => void
};

const ChatTitle = ({message, onClose}: Props) => {

  const tw = useTailwind()

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(message.message);
  };

  return (
    <View style={tw("flex flex-row")}>
      <TouchableOpacity onPress={copyToClipboard}>
        <Icon name="content-copy" type="material" size={30} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose}>
        <Icon name="close" type="material" size={30} />
      </TouchableOpacity>
    </View>
  );
};

export default ChatTitle;
