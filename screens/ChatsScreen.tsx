import { View, Text } from "react-native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { Card } from "@rneui/themed";

type Props = {};
type ChatsScreenRouteProp = RouteProp<RootStackParamList, "Chats">;

const ChatsScreen = (props: Props) => {
  const tw = useTailwind();

  const navigation = useNavigation<ChatsScreenNavigatorProp>();
  const [chats, setChats] = useState<any[]>([]);

  const {
    params: { discipline },
  } = useRoute<ChatsScreenRouteProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: discipline.title,
    });
  }, []);

  useEffect(() => {
    const getChats = async () => {
      const q = query(collection(db, `disciplines/${discipline.id}/chats`));
      const qSnap = await getDocs(q);
      let chats: any[] = qSnap.docs.map((chat) => ({
        ...chat.data(),
        chatId: chat.id,
      }));
      chats = await Promise.all(
        chats.map(async (chat) => {
          const chatQ = doc(db, `groups/${chat.groupId}`);
          const chatSnap = await getDoc(chatQ);
          return {
            ...chat,
            groupTitle: chatSnap.data().name,
          };
        })
      );
      setChats(chats);
    };
    getChats();
  }, []);

  console.log(chats);

  return (
    <View>
      <View>
        <Text>Доступные чаты</Text>
      </View>
      {chats.map((chat) => (
        <Card>
          <View style={tw("flex flex-row justify-between")}>
            <Text>
              Группа: <Text style={tw("font-bold")}>{chat.groupTitle}</Text>
            </Text>
            <Text
              style={tw("text-blue-400 underline")}
              onPress={() =>
                navigation.navigate("Chat", {
                  discipline,
                  group: {
                    groupId: chat.groupId,
                    groupTitle: chat.groupTitle,
                  },
                })
              }
            >
              Перейти
            </Text>
          </View>
        </Card>
      ))}
    </View>
  );
};

export default ChatsScreen;
