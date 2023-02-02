import { Icon } from "@rneui/themed";
import React, { useState } from "react";
import { Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import { addMessage } from "../../api";
import { selectUser } from "../../features/userSlice";
import type { DBMessage } from "../../typings";
import { returnHexCode } from "../../utils";

type Props = {
  setIsReplyingOnMessage: (isReply: boolean) => void;
  setIsScrollToBottomVisible: (isVisible: boolean) => void;
  setActiveMessage: (message: null | DBMessage) => void;
  isReplyingOnMessage: boolean;
  activeMessage: DBMessage | null;
  chatId: string;
};

export const MessageForm: React.FC<Props> = React.memo(
  ({
    setIsReplyingOnMessage,
    setIsScrollToBottomVisible,
    setActiveMessage,
    isReplyingOnMessage,
    activeMessage,
    chatId,
  }) => {
    const tw = useTailwind();
    const [message, setMessage] = useState("");
    const user = useSelector(selectUser);
    // sendMessage function
    const sendMessage = async () => {
      await addMessage(chatId, {
        text: message,
        displayName: user.name,
        email: user.email,
        type: user.type,
        photoUrl: user.img,
        replyingMessage: isReplyingOnMessage ? activeMessage?.id : null,
      }).then(() => {
        Keyboard.dismiss();
        setMessage("");
        if (isReplyingOnMessage) {
          setIsReplyingOnMessage(false);
          setActiveMessage(null);
        }
      });
    };

    return (
      <View style={tw(`w-full bg-white absolute left-0 bottom-0`)}>
        {/* Replying on message */}
        {isReplyingOnMessage && (
          <View
            style={tw(
              "flex flex-row items-center justify-between bg-white px-4 py-2 border-b border-gray-200"
            )}
          >
            <Icon name="redo" type="material" size={30} color={returnHexCode(user.theme)} />
            <View style={tw("w-0.5 h-full bg-gray-400 ml-4")} />
            <View style={tw("flex-1 pl-4")}>
              <Text style={tw("font-semibold")}>{activeMessage?.displayName}</Text>
              <Text style={tw("text-gray-400")}>{activeMessage?.text}</Text>
            </View>
            <TouchableOpacity onPress={() => setIsReplyingOnMessage(false)}>
              <Icon name="close" type="material" size={30} color="#374151" />
            </TouchableOpacity>
          </View>
        )}

        <View style={tw("flex flex-row items-center")}>
          {/* Reply message or Reply Post from discipline... */}
          <TextInput
            onFocus={() => setIsScrollToBottomVisible(false)}
            style={tw("bg-white flex-1 mr-4 p-3 h-12 text-[18px]")}
            placeholder="Введите текст..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity onPress={sendMessage} style={tw("pr-2")}>
            <Icon name="send" type="material" color={returnHexCode(user.theme)} size={30} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);
