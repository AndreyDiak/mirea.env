import moment from "moment";
import React from "react";
import { Text, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import UserAvatar from "./UserAvatar";

type Props = {
  message: Message;
  email: string
};

const Message = ({ message, email }: Props) => {

  const tw = useTailwind();

  return (
    <View
      style={[
        tw(
          `flex flex-row p-4 ${
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
          `${
            message.email === email ? "bg-white" : "bg-blue-400"
          } rounded-md mb-2 px-6 pt-4 pb-2 relative`
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
        <Text
          style={tw(
            `${
              message.email === email ? "text-gray-600" : "text-white"
            } font-semibold text-sm text-center mb-2`
          )}
        >
          {message.message}
        </Text>
        <View>
          <Text
            style={tw(
              `text-xs ${
                message.email === email ? "" : "text-right text-gray-800"
              }`
            )}
          >
            {message.timestamp // @ts-ignore
              ? moment(message.timestamp.toDate()).format("LT")
              : "..."}
          </Text>
        </View>
        <View
          style={tw(
            `absolute -bottom-5 ${
              message.email === email ? "-right-7" : "-left-3"
            }`
          )}
        >
          <UserAvatar source={message.photoUrl} size={"small"} />
        </View>
      </View>
    </View>
  );
};

export default Message;
