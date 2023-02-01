import { View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";
import { Icon } from "@rneui/themed";
import * as Clipboard from "expo-clipboard";
import { DBMessage } from "../../typings";

type Props = {
  message: DBMessage;
  onClose: () => void;
  replyOnMessage: () => void;
};

export const ChatTitle = ({ message, onClose, replyOnMessage }: Props) => {
  const tw = useTailwind();

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(message.message);
    ToastAndroid.show("Скопировано в буфер обмена", 1000);
    onClose();
  };

  return (
    <View style={tw("flex flex-row")}>
      <TouchableOpacity onPress={copyToClipboard} style={tw("mr-4")}>
        <Icon name="content-copy" type="material" size={30} color="#374151" />
      </TouchableOpacity>
      <TouchableOpacity onPress={replyOnMessage} style={tw("mr-4")}>
        <Icon name="redo" type="material" size={30} color="#374151" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose}>
        <Icon name="close" type="material" size={30} color="#374151" />
      </TouchableOpacity>
    </View>
  );
};
