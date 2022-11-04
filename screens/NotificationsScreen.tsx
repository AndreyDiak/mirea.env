import { View, Text } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";
import { useSelector } from "react-redux";
import { getNotifications, getUser } from "../features/userSlice";
import { useNotifications } from "../hooks/useNotifications";
import { Card, Icon } from "@rneui/themed";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { returnHexCode } from "../utils/returnHexCode";

type Props = {};

const NotificationsScreen = (props: Props) => {
  const tw = useTailwind();
  // const notifications = useSelector(getNotifications);
  const user = useSelector(getUser);
  const notifications = useSelector(getNotifications);
  // console.log(notifications);
  
  const submitNotification = async (notificationId: string) => {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, {
      isChecked: true,
    })
      .then((res) => console.log("completed!"))
      .catch((err) => console.log(err));
  };

  return (
    <View style={tw("p-6")}>
      {notifications?.length ? (
        notifications.map((notification) => (
          <Card key={notification.notificationId}>
            <Card.Title style={tw("font-bold text-lg")}>
              {notification.title}
            </Card.Title>
            <Card.Divider />
            <View style={tw("mb-4")}>
              <Text>{notification.text}</Text>
            </View>
            <Card.Divider />
            <View>
              <Text
                style={tw("text-right text-blue-400")}
                onPress={() => submitNotification(notification.notificationId)}
              >
                Я прочитал
              </Text>
            </View>
          </Card>
        ))
      ) : (
        <View style={tw("h-full w-full flex justify-center items-center")}>
          <View>
            <Text style={tw("text-center mt-4 mb-2 text-xl")}>
              У вас нет уведомлений...
            </Text>
            <Icon
              name="sentiment-very-dissatisfied"
              type="material"
              color={returnHexCode(user?.theme as AppTheme)}
              size={30}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default NotificationsScreen;
