import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useLayoutEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import UserAvatar from "./UserAvatar";

type Props = {
  message: Message;
  email: string;
  nextMessageEmail: string | null;
};

const Message = ({ message, email, nextMessageEmail }: Props) => {
  const tw = useTailwind();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRigth: () => <View><Text>hello</Text></View>
    })
  })

  const onMessagePress = () => {
    console.log('short')
  }

  const onMessageLongPress = () => {
    console.log('long')
  }

  return (
    <TouchableOpacity
      onPress={onMessagePress}
      onLongPress={onMessageLongPress}
      style={[
        tw(
          `flex flex-row px-4 ${
            message.email === email ? "justify-end" : "justify-start"
          }`
        ),
        {
          shadowRadius: 10,
          shadowColor: "red",
          shadowOffset: {
            height: 10,
            width: 10,
          },
          shadowOpacity: 1,
        },
      ]}
    >
      <View
        key={message.messageId}
        style={tw(
          `rounded-md px-4 pt-3 pb-2 relative
          ${nextMessageEmail === message.email ? "mb-2" : "mb-6"}
          ${message.email === email ? "bg-white pr-6" : "bg-blue-400 pl-6"}
          `
        )}
      >
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
    </TouchableOpacity>
  );
};

export default Message;
