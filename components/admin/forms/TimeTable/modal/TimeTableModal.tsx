import React, { useState } from "react";

import { FlatList, Text, TextInput, View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { Lesson } from "../../../../../typings";
import { COLORS_COMMON } from "../../../../../utils";
import { Button } from "../../../../Button";
import { useGlobalModalContext } from "../../../../common";

interface Props {
   lessons: Lesson[];
   dayIndex: number;
   handleTimetable: (dayIndex: number, newLessons: Lesson[]) => void;
}

export function TimeTableModal({ handleTimetable, lessons, dayIndex }: Props) {
   const tw = useTailwind();

   const [newLessons, setNewLessons] = useState<Lesson[]>([
      ...lessons, // сетаем то, что уже записали
   ]);

   /* TODO @raymix делаем здесь useState()
    * на кнопку "сохранить" мы делаем handleTimetable
    * если пользователь просто закрывает то мы ничего не сохраняем
    */
   const { closeModal } = useGlobalModalContext();

   const changeName = (name: string, lessonIndex: number) => {
      const copy = [...newLessons];
      copy[lessonIndex].name = name;
      setNewLessons(copy);
   };

   const changeCabinet = (cabinet: string, lessonIndex: number) => {
      const copy = [...newLessons];
      copy[lessonIndex].cabinet = cabinet;
      setNewLessons(copy);
   };

   const onCloseHandler = () => {
      closeModal();
      handleTimetable(dayIndex, newLessons);
   };

   return (
      <>
         <FlatList
            data={lessons}
            style={tw("mb-2")}
            renderItem={({ item: lesson, index }) => {
               // TODO @raymix разобраться как сделать лучше
               return (
                  <View style={tw("flex flex-row my-1 min-w-full items-center")}>
                     <Text
                        style={{
                           color: COLORS_COMMON.DISABLED,
                           marginRight: 4,
                           fontSize: 14,
                        }}
                     >
                        {index + 1}
                     </Text>
                     <TextInput
                        placeholder="Предмет"
                        value={newLessons[index].name}
                        onChangeText={(text) => {
                           changeName(text, index);
                        }}
                        style={[
                           tw("p-2 flex-1"),
                           {
                              borderBottomWidth: 1,
                              borderBottomColor: COLORS_COMMON.DISABLED,
                           },
                        ]}
                     />
                     <TextInput
                        placeholder="Б-XXX"
                        value={newLessons[index].cabinet}
                        onChangeText={(text) => {
                           changeCabinet(text, index);
                        }}
                        style={[
                           tw("w-[60px] p-2"),
                           {
                              borderBottomWidth: 1,
                              borderBottomColor: COLORS_COMMON.DISABLED,
                           },
                        ]}
                     />
                  </View>
               );
            }}
         />
         <Button title="Сохранить" callback={onCloseHandler} />
      </>
   );
}
