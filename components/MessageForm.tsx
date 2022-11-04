import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { Icon } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import { getUser } from "../features/userSlice";
import { returnHexCode } from "../utils/returnHexCode";
import { theme } from "../tailwind.config";

type Props = {
  setIsReplyingOnMessage: (isReply: boolean) => void;
  setIsScrollToBottomVisible: (isVisible: boolean) => void;
  setActiveMessage: (message: null | Message) => void;
  isReplyingOnMessage: boolean;
  activeMessage: Message | null;
  chatId: string;
};

const MessageForm = ({
  setIsReplyingOnMessage,
  setIsScrollToBottomVisible,
  setActiveMessage,
  isReplyingOnMessage,
  activeMessage,
  chatId
}: Props) => {
  const tw = useTailwind();
  const [message, setMessage] = useState("");
  const user = useSelector(getUser);
  // sendMessage function
  const sendMessage = async () => {
    await addDoc(collection(db, `chats/${chatId}/messages`), {
      message: message,
      timestamp: serverTimestamp(),
      displayName: user?.name,
      email: user?.email,
      type: user?.type,
      photoUrl: user?.img,
      replyingMessage: isReplyingOnMessage ? activeMessage?.messageId : null,
    }).then(async (res) => {
      Keyboard.dismiss();
      setMessage("");
      if (isReplyingOnMessage) {
        setIsReplyingOnMessage(false);
        setActiveMessage(null);
      }
    });
  };

  return (
    <View style={tw(`w-full bg-white`)}>
      {/* Replying on message */}
      {isReplyingOnMessage && (
        <View
          style={tw(
            "flex flex-row items-center justify-between bg-white px-4 py-2 border-b border-gray-200"
          )}
        >
          <Icon name="redo" type="material" size={30} color={returnHexCode(user?.theme as AppTheme)} />
          <View style={tw("w-0.5 h-full bg-gray-400 ml-4")} />
          <View style={tw("flex-1 pl-4")}>
            <Text style={tw("font-semibold")}>
              {activeMessage?.displayName}
            </Text>
            <Text style={tw("text-gray-400")}>{activeMessage?.message}</Text>
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
          <Icon name="send" type="material" color={returnHexCode(user?.theme as AppTheme)} size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageForm;
