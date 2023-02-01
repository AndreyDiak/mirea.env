import { useNavigation } from "@react-navigation/native";
import { Card, Icon } from "@rneui/themed";
import { addDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import { selectUser } from "../../features/userSlice";
import type { Chat, Discipline, DisciplineScreenNavigatorProp } from "../../typings";
import { DBQueries } from "../../typings/enums";
import { createCollection, QUERIES, returnHexCode } from "../../utils";

type Props = {
  discipline: Discipline;
};

export const DisciplineCard = ({ discipline }: Props) => {
  const tw = useTailwind();
  const navigation = useNavigation<DisciplineScreenNavigatorProp>();
  const user = useSelector(selectUser);

  const [chatId, setChatId] = useState("");

  useEffect(() => {
    const getChatInfo = async () => {
      if (user.type === "student") {
        const q = QUERIES.CREATE_MULTIPLE_QUERY<Chat>(DBQueries.CHATS, [
          {
            fieldName: "disciplineId",
            fieldValue: discipline.id,
            opStr: "==",
          },
          {
            fieldName: "groupId",
            fieldValue: user.groupId,
            opStr: "==",
          },
        ]);
        const snap = await getDocs(q);
        if (snap.docs.length > 0) {
          const chatId = snap.docs[0].id;
          setChatId(chatId);
        } else {
          // создаем новый чат...
          await addDoc(createCollection(DBQueries.CHATS), {
            disciplineId: discipline.id,
            groupId: user.groupId,
          }).then((res) => {
            setChatId(res.id);
          });
        }
      }
    };
    getChatInfo();
  }, []);

  return (
    <Card>
      <Card.Title style={tw("font-bold")}>{discipline.name}</Card.Title>
      <Card.Divider />
      <View style={tw("flex flex-row justify-between")}>
        <TouchableOpacity
          style={tw("flex flex-row items-center")}
          onPress={() => navigation.navigate("Discipline", { discipline })}
        >
          <Text
            style={[
              tw("underline font-bold mr-2"),
              {
                color: returnHexCode(user.theme),
              },
            ]}
          >
            Материалы
          </Text>
          <Icon name="inventory" type="material" color={returnHexCode(user.theme)} />
        </TouchableOpacity>

        <TouchableOpacity
          style={tw("flex flex-row items-center")}
          onPress={() =>
            user.type === "student"
              ? navigation.navigate("Chat", {
                  discipline,
                  groupId: user.groupId,
                  chatId,
                })
              : navigation.navigate("Chats", { discipline })
          }
        >
          <Text style={tw("font-bold text-gray-600 mr-2")}>Перейти в чат</Text>
          <Icon name="textsms" type="material" color={"#4b5563"} />
        </TouchableOpacity>
      </View>
    </Card>
  );
};
