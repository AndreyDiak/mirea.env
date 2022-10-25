import { useNavigation } from "@react-navigation/native";
import { Card, Icon } from "@rneui/themed";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import { getUser } from "../features/userSlice";
import { db } from "../firebase";

type Props = {
  discipline: Discipline;
};

const DisciplineCard = ({ discipline }: Props) => {
  const tw = useTailwind();
  const navigation = useNavigation<DisciplineScreenNavigatorProp>();
  const user = useSelector(getUser);

  const [chatId, setChatId] = useState("");
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    const getChatInfo = async () => {
      if (user?.type === "student") {
        const groupQ = query(
          collection(db, "groups"),
          where("name", "==", user.group)
        );
        const groupSnap = await getDocs(groupQ);
        const groupId = groupSnap.docs[0].id;

        setGroupId(groupId);
        const q = query(
          collection(db, "chats"),
          where("disciplineId", "==", discipline.id),
          where("groupId", "==", groupId)
        );
        const snap = await getDocs(q);
        if (snap.docs.length > 0) {
          const chatId = snap.docs[0].id;
          setChatId(chatId);
        }
      }
    };
    getChatInfo();
  }, []);

  return (
    <Card>
      <Card.Title style={tw("font-bold")}>{discipline.title}</Card.Title>
      <Card.Divider />
      <View style={tw("flex flex-row justify-between")}>
        <TouchableOpacity
          style={tw("flex flex-row items-center")}
          onPress={() => navigation.navigate("Discipline", { discipline })}
        >
          <Text style={tw("text-blue-400 underline font-bold mr-2")}>
            Материалы
          </Text>
          <Icon name="inventory" type="material" color={"#60a5fa"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={tw("flex flex-row items-center")}
          onPress={() =>
            user?.type === "student"
              ? navigation.navigate("Chat", {
                  discipline,
                  groupId,
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

export default DisciplineCard;
