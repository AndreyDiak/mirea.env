import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { Card, Icon, Input } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

type Props = {
  name: string;
  lessons: string[][];
  current: string[];
  index: number;
  setLessons: (lessons: string[][]) => void;
};

export const TimeTableCard = ({
  name,
  lessons,
  current,
  index,
  setLessons,
}: Props) => {
  const tw = useTailwind();
  const [isCardVisible, setIsCardVisible] = useState(false);

  // Обновляем поле с названием предмета...
  const changeText = (lessonName: string, lessonIndex: number) => {
    const newTimeTable = [...lessons];
    newTimeTable[index][lessonIndex] = lessonName;
    setLessons(newTimeTable);
  };

  return (
    <Card>
      <View style={tw("flex flex-row justify-between items-center")}>
        <Text>{name}</Text>
        <TouchableOpacity onPress={() => setIsCardVisible(!isCardVisible)}>
          <Icon
            name={!isCardVisible ? "expand-more" : "expand-less"}
            color="#60a5fa"
            containerStyle={tw("bg-gray-50 rounded-full p-1")}
          />
        </TouchableOpacity>
      </View>
      {isCardVisible && (
        <ScrollView>
          {current.map((lesson, index) => (
            <View>
              <Input
                value={lesson}
                placeholder={`${index + 1} lesson...`}
                onChangeText={(text) => changeText(text, index)}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </Card>
  );
};
