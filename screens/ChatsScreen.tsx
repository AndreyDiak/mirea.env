import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Card } from "@rneui/themed";
import { useSelector } from "react-redux";
import { getUser } from "../features/userSlice";
import { returnHexCode } from "../utils/returnHexCodes";

type Props = {};
type ChatsScreenRouteProp = RouteProp<RootStackParamList, "Chats">;

const ChatsScreen = (props: Props) => {
  const tw = useTailwind();

  const navigation = useNavigation<ChatsScreenNavigatorProp>();
  const [chats, setChats] = useState<any[]>([]);
  const user = useSelector(getUser);
  const {
    params: { discipline },
  } = useRoute<ChatsScreenRouteProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: discipline.name,
    });
  }, []);

  useEffect(() => {
    const getChats = async () => {
      const q = query(
        collection(db, "chats"),
        where("disciplineId", "==", discipline.id)
      );
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
            groupInfo: chatSnap.data(),
          };
        })
      );
      setChats(
        chats.sort((prev, next) =>
          prev.groupInfo.name > next.groupInfo.name ? 1 : -1
        )
      );
    };
    getChats();
  }, []);

  return (
    <View>
      <View>
        <Text style={tw("text-center text-lg pt-2")}>Доступные чаты</Text>
      </View>
      <FlatList
        data={chats}
        renderItem={(item) => (
          <Card key={item.item.chatId}>
            <View style={tw("flex flex-row justify-between")}>
              <Text>
                Группа:{" "}
                <Text style={tw("font-bold")}>{item.item.groupInfo.name}</Text>
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Chat", {
                    discipline,
                    groupId: item.item.groupId,
                    chatId: item.item.chatId,
                  })
                }
              >
                <Text
                  style={[
                    tw("underline"),
                    { color: returnHexCode(user?.theme as AppTheme) },
                  ]}
                >
                  Перейти
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />
    </View>
  );
};

export default ChatsScreen;
