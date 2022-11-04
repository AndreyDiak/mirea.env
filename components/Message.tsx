import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, query } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { db } from "../firebase";
import UserAvatar from "./UserAvatar";

type Props = {
  message: Message;
  email: string;
  chatId: string;
  theme: AppTheme;
  nextMessageEmail: string | null;
  isBacklight: boolean;
  setBacklighMessage: () => void;
};

const Message = ({
  message,
  email,
  nextMessageEmail,
  isBacklight,
  chatId,
  theme,
  setBacklighMessage,
}: Props) => {
  const tw = useTailwind();

  const [replyingMessage, setReplyingMessage] = useState<Message | null>(null);

  useEffect(() => {
    const getReplyingMessage = async () => {
      if (!!message.replyingMessage) {
        const replyingMessageSnap = await getDoc(
          doc(db, `chats/${chatId}/messages/${message.replyingMessage}`)
        );
        const replyingMessage = {
          ...replyingMessageSnap.data(),
          messageId: replyingMessageSnap.id,
        };
        setReplyingMessage(replyingMessage as Message);
      }
    };
    getReplyingMessage();
  }, []);

  return (
    <View
      style={[
        tw(
          `flex flex-row px-6 ${
            message.email === email ? "justify-end" : "justify-start"
          }
          ${isBacklight ? `bg-${theme}-100` : ""}`
        ),
      ]}
    >
      <View
        key={message.messageId}
        style={tw(
          `rounded-lg px-3 pt-3 pb-2 relative
          ${
            nextMessageEmail === message.email
              ? "mb-2"
              : `mb-6 ${message.email === email ? "pr-6" : "pl-6"}`
          }
          ${message.email === email ? "bg-white" : `bg-${theme}-400`}
          `
        )}
      >
        {/* Replying message... */}
        {!!replyingMessage && (
          <TouchableOpacity onPress={setBacklighMessage}>
            <View style={tw("flex flex-row pt-1")}>
              <View style={tw(`w-0.5 h-full bg-${theme}-800 mr-2`)}></View>
              <View>
                <Text
                  style={tw(
                    `font-semibold ${
                      message.email === email ? "text-gray-800" : "text-white"
                    }`
                  )}
                >
                  {replyingMessage.displayName}
                </Text>
                <Text
                  style={tw(
                    `${
                      message.email === email
                        ? "text-gray-400"
                        : "text-gray-100"
                    }`
                  )}
                >
                  {replyingMessage.message}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        {/* Message Owner... */}
        <Text
          style={tw(
            `${
              message.email === email
                ? "right-2 text-gray-400"
                : "left-2 text-gray-200"
            } absolute text-xs `
          )}
        >
          {message.email === email
            ? "Вы"
            : message.type === "student"
            ? "студент"
            : "преподаватель"}
        </Text>
        {/* Message Text... */}
        <View style={tw("flex flex-row items-end w-full")}>
          <Text
            style={[
              tw(
                `${message.email === email ? "text-gray-600" : "text-white"} 
              font-semibold text-sm mr-2`
              ),
              { maxWidth: "85%" },
            ]}
          >
            {message.message}
          </Text>
          {/* Message Date... */}
          <Text
            style={tw(
              `text-xs -mb-1 ${
                message.email === email ? "" : "text-right text-gray-800"
              }`
            )}
          >
            {message.timestamp // @ts-ignore
              ? moment(message.timestamp.toDate()).format("LT")
              : "..."}
          </Text>
        </View>
        {/* Message Owner Avatar... */}
        {nextMessageEmail !== message.email && (
          <View
            style={tw(
              `absolute -bottom-5 
            ${message.email === email ? "-right-7" : "-left-3"}`
            )}
          >
            <UserAvatar
              title={message.displayName[0]}
              source={message.photoUrl}
              size={"small"}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default Message;
