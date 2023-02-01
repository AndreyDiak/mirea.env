import { Icon } from "@rneui/themed";
import React, { useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import { selectUser } from "../../features/userSlice";
import type { DBMessage } from "../../typings";
import { returnHexCode } from "../../utils/returnHexCodes";
import { Message } from "./Message";

type Props = {
  messages: DBMessage[];
  chatId: string;
  isScrollToBottomVisible: boolean;
  selectedMessageId: string | undefined;
  setIsScrollToBottomVisible: (isVisible: boolean) => void;
  setSelectedMessage: (selectedMessage: DBMessage) => void;
  setIsHeaderMenuVisible: (isVisible: boolean) => void;
};

export const Messages = ({
  messages,
  chatId,
  isScrollToBottomVisible,
  selectedMessageId,
  setIsScrollToBottomVisible,
  setSelectedMessage,
  setIsHeaderMenuVisible,
}: Props) => {
  const tw = useTailwind();
  const user = useSelector(selectUser);
  const flatListRef = useRef();

  const [backligthMessage, setBackligntMessage] = useState<string | null>(null);

  const scrollToIndex = (activeMessageIndex: string | null) => {
    if (activeMessageIndex) {
      // @ts-ignore all exists...
      flatListRef.current.scrollToIndex({
        animating: true,
        index: messages.findIndex((msg) => msg.id === activeMessageIndex),
      });
    }
  };

  //scrollToBottom function
  const scrollToBottom = () => {
    // @ts-ignore all exists...
    flatListRef.current.scrollToEnd({ animating: true });
    setIsScrollToBottomVisible(false);
    // setBackligntMessage(null);
  };

  // onMessagePress function...
  const onMessagePress = (message: DBMessage) => {};

  // onMessageLongPress function...
  const onMessageLongPress = (message: DBMessage) => {
    setIsHeaderMenuVisible(true);
    setSelectedMessage(message);
  };

  return (
    <>
      {isScrollToBottomVisible && messages.length > 10 && (
        <TouchableOpacity
          onPress={scrollToBottom}
          style={tw(
            "bg-white w-16 h-16 flex items-center justify-center rounded-full absolute right-5 bottom-20 z-10"
          )}
        >
          <Icon
            name="keyboard-arrow-down"
            type="material"
            color={returnHexCode(user.theme)}
            size={40}
          />
        </TouchableOpacity>
      )}
      {messages.length > 0 ? (
        <FlatList
          // @ts-ignore some ref issues..
          ref={flatListRef}
          style={tw("w-full py-2")}
          data={messages}
          scrollEnabled
          onScrollEndDrag={() => {
            if (!isScrollToBottomVisible) {
              setIsScrollToBottomVisible(true);
            }
          }}
          onEndReached={() => setIsScrollToBottomVisible(false)}
          showsVerticalScrollIndicator={false}
          // initialScrollIndex={messages.length - 3}
          renderItem={({ item: message, index }) => (
            <TouchableOpacity
              onPress={() => onMessagePress(message)}
              onLongPress={() => onMessageLongPress(message)}
            >
              <Message
                key={message.id}
                message={message}
                email={user.email}
                theme={user.theme}
                nextMessageEmail={!!messages[index + 1] ? messages[index + 1].email : null}
                isBacklight={message.id === selectedMessageId || message.id === backligthMessage}
                chatId={chatId}
                setBacklighMessage={() => {
                  setBackligntMessage(message.replyingMessage);
                  scrollToIndex(message.replyingMessage);
                }}
              />
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={tw("flex flex-row items-center justify-center flex-1")}>
          <View>
            <Text style={tw("text-center text-lg w-5/6 mx-auto")}>
              Напишите первое сообщение в этом чате!
            </Text>
            <Icon
              name="chat-bubble-outline"
              type="material"
              color={returnHexCode(user.theme)}
              size={30}
            />
          </View>
        </View>
      )}
    </>
  );
};
