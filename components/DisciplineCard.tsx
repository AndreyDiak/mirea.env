import { useNavigation } from "@react-navigation/native";
import { Card, Icon } from "@rneui/themed";
import React from "react";
import { Text, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";

type Props = {
  discipline: Discipline;
  type: "student" | "teacher" | undefined;
};

const DisciplineCard = ({ discipline, type }: Props) => {
  const tw = useTailwind();
  const navigation = useNavigation<DisciplineScreenNavigatorProp>();

  return (
    <Card>
      <Card.Title style={tw("font-bold")}>{discipline.title}</Card.Title>
      <Card.Divider />
      <View style={tw("flex flex-row justify-between")}>
        <View style={tw("flex flex-row items-center")}>
          <Text
            style={tw("text-blue-400 underline font-bold mr-2")}
            onPress={() => navigation.navigate("Discipline", { discipline })}
          >
            Материалы
          </Text>
          <Icon name="inventory" type="material" color={"#60a5fa"} />
        </View>
        <View style={tw("flex flex-row items-center")}>
          <Text
            style={tw("font-bold text-gray-600 mr-2")}
            onPress={() =>
              type === "student"
                ? navigation.navigate("Chat")
                : navigation.navigate("Chats", { discipline })
            }
          >
            Перейти в чат
          </Text>
          <Icon name="textsms" type="material" color={"#4b5563"} />
        </View>
      </View>
    </Card>
  );
};

export default DisciplineCard;
