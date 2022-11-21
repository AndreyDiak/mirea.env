import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Card } from "@rneui/themed";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";
import CheckListSingle from "./CheckListSingle";
import TimeTableCard from "./TimeTableCard";
import Button from "../Button";
import { useTailwind } from "tailwind-rn/dist";

type Props = {};

const AddTimetableForm = (props: Props) => {
  const tw = useTailwind();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [lessons, setLessons] = useState([
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
  ]);

  const days = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];

  useEffect(() => {
    const getGroups = async () => {
      const q = query(collection(db, "groups"));
      const snap = await getDocs(q);
      const groups = snap.docs.map((group) => ({
        ...group.data(),
        groupId: group.id,
      }));
      setGroups(groups as Group[]);
    };
    getGroups();
  }, []);

  const loadTimeTable = async () => {
    if(!selectedGroup) {
      return;
    }
    await addDoc(collection(db, 'timetable'), {
      groupId: selectedGroup.groupId,
      timetable: lessons.map((lesson, index) => ({
        day: days[index],
        lessons: lesson
      }))
    })
  }

  return (
    <View>
      <Card>
        <Card.Title>Добавить расписание</Card.Title>
        <CheckListSingle
          title="Выбрать группу"
          attr="groupId"
          list={groups}
          selectedItem={selectedGroup}
          setSelectedItem={setSelectedGroup}
        />
        {/* Сделать добавление расписание к каждому дню */}
        <FlatList
          data={days}
          style={tw("max-h-[400px] mb-4")}
          renderItem={({ item, index }) => (
            <TimeTableCard
              key={index}
              name={item}
              lessons={lessons}
              current={lessons[index]}
              index={index}
              setLessons={setLessons}
            />
          )}
        />
        <Button title="Загрузить расписание" callback={loadTimeTable} />
      </Card>
    </View>
  );
};

export default AddTimetableForm;
