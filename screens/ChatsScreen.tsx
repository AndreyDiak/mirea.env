import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Card } from "@rneui/themed";
import React, { useLayoutEffect } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import { Loader } from "../components";
import { selectUser } from "../features/userSlice";
import { useChats } from "../hooks";
import type { ChatsScreenNavigatorProp, RootStackParamList } from "../typings";
import { returnHexCode } from "../utils/returnHexCodes";

type ChatsScreenRouteProp = RouteProp<RootStackParamList, "Chats">;

export const ChatsScreen = () => {
  const tw = useTailwind();

  const navigation = useNavigation<ChatsScreenNavigatorProp>();

  const user = useSelector(selectUser);

  const {
    params: { discipline },
  } = useRoute<ChatsScreenRouteProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: discipline.name,
    });
  }, []);

  const { chats, loading } = useChats(discipline.id);

  if (loading) {
    return <Loader text={"Загрузка чатов"} theme={user.theme} />;
  }

  return (
    <View>
      <View>
        <Text style={tw("text-center text-lg pt-2")}>Доступные чаты</Text>
      </View>
      <FlatList
        data={chats}
        renderItem={({ item: chat }) => (
          <Card key={chat.id}>
            <View style={tw("flex flex-row justify-between")}>
              <Text>
                Группа: <Text style={tw("font-bold")}>{chat.groupName}</Text>
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Chat", {
                    ...chat,
                    discipline,
                  })
                }
              >
                <Text style={[tw("underline"), { color: returnHexCode(user.theme) }]}>Перейти</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />
    </View>
  );
};
