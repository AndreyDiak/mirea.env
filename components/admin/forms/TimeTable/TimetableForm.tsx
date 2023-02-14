import React, { useState } from "react";

import { FlatList, Text, View } from "react-native";

import { Card } from "@rneui/themed";
import { addDoc } from "firebase/firestore";
import { useTailwind } from "tailwind-rn/dist";

import { useGroups, useInstitutes } from "../../../../hooks/login";
import { Day, Group, Institute } from "../../../../typings";
import { DB_PATHS, LFilter } from "../../../../typings/enums";
import { createCollection } from "../../../../utils";
import { Button } from "../../../Button";
import { CheckListSingle } from "../../checklist/CheckListSingle";
import { TimeTableCard } from "./TimeTableCard";

const lessonsTemplate: string[][] = [
   ["", "", "", "", "", ""], // Понедельник
   ["", "", "", "", "", ""], // Вторник
   ["", "", "", "", "", ""], // Среда
   ["", "", "", "", "", ""], // Четверг
   ["", "", "", "", "", ""], // Пятница
   ["", "", "", "", "", ""], // Суббота
];

const days: Day[] = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

export function TimetableForm() {
   const tw = useTailwind();

   const [lessons, setLessons] = useState(lessonsTemplate);
   const [selectedInstitute, setSelectedInstitute] = useState<Institute>(null);
   const [selectedGroup, setSelectedGroup] = useState<Group>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const { institutes, loading: ILoading } = useInstitutes();
   const { groups, loading: GLoading } = useGroups([selectedInstitute], LFilter.GROUPS);

   const loadTimeTable = async () => {
      if (!selectedGroup) {
         return;
      }
      setLoading(true);
      await addDoc(createCollection(DB_PATHS.TIMETABLES), {
         groupId: selectedGroup.id,
         timetable: lessons.map((lesson, index) => ({
            day: days[index],
            lessons: lesson,
         })),
      });
      setLoading(false);
      setLessons(lessonsTemplate);
      setSelectedInstitute(null);
      setSelectedGroup(null);
   };

   // TODO разобраться с логикой, происходит постоянный ререндер

   return (
      <View>
         <Card>
            <Card.Title>Добавить расписание</Card.Title>
            <CheckListSingle
               title="Выбрать институт"
               list={institutes}
               selectedItem={selectedInstitute}
               setSelectedItem={(item) => {
                  setSelectedInstitute(item as Institute);
                  setSelectedGroup(null);
               }}
            />
            {selectedInstitute && (
               <>
                  <Text style={tw("text-center mb-4")}>
                     Институт: <Text style={tw("font-bold")}>{selectedInstitute.shortName}</Text>
                  </Text>
                  <CheckListSingle
                     title="Выбрать группу"
                     list={groups}
                     selectedItem={selectedGroup}
                     setSelectedItem={setSelectedGroup as (item: Group) => void}
                  />
               </>
            )}
            {/* TODO разобраться с логикой и сделать более грамотно  */}
            {selectedInstitute && selectedGroup && (
               <>
                  <Text style={tw("text-center mb-4")}>
                     Группа: <Text style={tw("font-bold")}>{selectedGroup.name}</Text>
                  </Text>
                  <FlatList
                     data={days}
                     style={tw("max-h-[300px] mb-4")}
                     renderItem={({ item: day, index }) => (
                        <TimeTableCard
                           key={index}
                           dayName={day}
                           lessons={lessons}
                           dayIndex={index}
                           setLessons={setLessons}
                        />
                     )}
                  />
               </>
            )}
            <Button title="Загрузить расписание" callback={loadTimeTable} disabled={loading} />
         </Card>
      </View>
   );
}
