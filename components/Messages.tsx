import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import { Icon } from "@rneui/themed";
import Message from "./Message";
import { useSelector } from "react-redux";
import { getUser } from "../features/userSlice";
import { returnHexCode } from "../utils/returnHexCodes";

type Props = {
  messages: Message[];
  chatId: string;
  isScrollToBottomVisible: boolean;
  selectedMessageId: string | undefined;
  setIsScrollToBottomVisible: (isVisible: boolean) => void;
  setSelectedMessage: (selectedMessage: Message) => void;
  setIsHeaderMenuVisible: (isVisible: boolean) => void;
};

const Messages = ({
  messages,
  chatId,
  isScrollToBottomVisible,
  selectedMessageId,
  setIsScrollToBottomVisible,
  setSelectedMessage,
  setIsHeaderMenuVisible,
}: Props) => {
  const tw = useTailwind();
  const user = useSelector(getUser);
  const flatListRef = useRef();

  const [backligthMessage, setBackligntMessage] = useState<string | null>(null);

  const scrollToIndex = (activeMessageIndex: string | null) => {
    if (activeMessageIndex) {
      // @ts-ignore all exists...
      flatListRef.current.scrollToIndex({
        animating: true,
        index: messages.findIndex(
          (msg) => msg.messageId === activeMessageIndex
        ),
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
  const onMessagePress = (message: Message) => {};

  // onMessageLongPress function...
  const onMessageLongPress = (message: Message) => {
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
            color={returnHexCode(user?.theme as AppTheme)}
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
          renderItem={(item) => (
            <TouchableOpacity
              onPress={() => onMessagePress(item.item)}
              onLongPress={() => onMessageLongPress(item.item)}
            >
              <Message
                key={item.index}
                message={item.item}
                email={user?.email as string}
                theme={user?.theme as AppTheme}
                nextMessageEmail={
                  !!messages[item.index + 1]
                    ? messages[item.index + 1].email
                    : null
                }
                isBacklight={
                  item.item.messageId === selectedMessageId ||
                  item.item.messageId === backligthMessage
                }
                chatId={chatId}
                setBacklighMessage={() => {
                  setBackligntMessage(item.item.replyingMessage);
                  scrollToIndex(item.item.replyingMessage);
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
              color={returnHexCode(user?.theme as AppTheme)}
              size={30}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default Messages;
