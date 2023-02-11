import React, { useState } from "react";

import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { Card, Icon, Input } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

interface Props {
   dayName: string;
   lessons: string[][];
   dayIndex: number;
   setLessons: (lessons: string[][]) => void;
}

export function TimeTableCard({ dayName, lessons, dayIndex, setLessons }: Props) {
   const tw = useTailwind();
   const [isCardVisible, setIsCardVisible] = useState(false);

   // Обновляем поле с названием предмета...
   const changeText = (lessonName: string, lessonIndex: number) => {
      const newTimeTable = [...lessons];
      newTimeTable[dayIndex][lessonIndex] = lessonName;
      setLessons(newTimeTable);
   };

   return (
      <Card>
         <View style={tw("flex flex-row justify-between items-center")}>
            <Text>{dayName}</Text>
            <TouchableOpacity onPress={() => setIsCardVisible(!isCardVisible)}>
               <Icon
                  name={!isCardVisible ? "expand-more" : "expand-less"}
                  color="#60a5fa"
                  containerStyle={tw("bg-gray-50 rounded-full p-1")}
               />
            </TouchableOpacity>
         </View>
         {isCardVisible && (
            <FlatList
               data={lessons[dayIndex]}
               renderItem={({ item: lesson, index }) => {
                  return (
                     <Input
                        key={index}
                        value={lesson}
                        placeholder={`${index + 1} lesson`}
                        onChangeText={(text) => changeText(text, index)}
                     />
                  );
               }}
            />
         )}
      </Card>
   );
}
