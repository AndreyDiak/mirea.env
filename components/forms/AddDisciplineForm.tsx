import { View, Text, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { Card, CheckBox, Input } from "@rneui/themed";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useTailwind } from "tailwind-rn/dist";
import Button from "../Button";

type Props = {};
type ToggleItem = {
  type: 'group' | 'teacher'
  item: Group | Teacher
  selected: (Group | Teacher)[] 
  setSelected: (selected: (Group | Teacher)[]) => void
}
const AddDisciplineForm = (props: Props) => {
  const tw = useTailwind();

  const [disciplineTitle, setDisciplineTitle] = useState("");

  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);

  // TODO переделать на универасальный лад чтобы не было повторение кода...

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
    const getTeachers = async () => {
      const q = query(collection(db, "users"), where("type", "==", "teacher"));
      const snap = await getDocs(q);
      const teachers = snap.docs.map((teacher) => ({
        ...teacher.data(),
        userId: teacher.id,
      }));
      setTeachers(teachers as Teacher[])
    };
    getGroups();
    getTeachers();
  }, []);

  const toggleGroup = (newGroup: Group) => {
    let groupsCopy = [...selectedGroups];
    if (selectedGroups.some((group) => group.groupId === newGroup.groupId)) {
      let index = selectedGroups.findIndex(
        (group) => group.groupId === newGroup.groupId
      );
      groupsCopy.splice(index, 1);
    } else {
      groupsCopy.push(newGroup);
    }
    setSelectedGroups(groupsCopy);
  };

  const toggleItem = ({item, type, selected, setSelected}: ToggleItem) => {
    let selectedCopy = [...selected];
    if(type === 'group') {
      //@ts-ignore we know, thats this is a group
      if (selected.some((group) => group.groupId === item.groupId)) {
        let index = selected.findIndex(
          //@ts-ignore we know, thats this is a group
          (group) => group.groupId === item.groupId
        );
        selectedCopy.splice(index, 1);
      }
      } else if(type === 'teacher') {
        if (selected.some((group) => group.userId === item.userId)) {
          let index = selected.findIndex(
            //@ts-ignore we know, thats this is a group
            (group) => group.userId === item.userId
          );
          selectedCopy.splice(index, 1);
        }
    } else {
      selectedCopy.push(item);
    }
    
    setSelected(selectedCopy)
  }

  const addDiscipline = async () => {
    if (disciplineTitle === "" || selectedGroups.length === 0) {
      return;
    }
    await addDoc(collection(db, "disciplines"), {
      groups: selectedGroups,
      title: disciplineTitle,
      teachers: [],
    }).then(() => {
      console.log("discipline added");
      setDisciplineTitle("");
      setSelectedGroups([]);
    });
  };

  return (
    <View>
      <Card>
        <Card.Title>Добавить дисциплину</Card.Title>
        <Input
          label="Название дисциплины"
          value={disciplineTitle}
          onChangeText={setDisciplineTitle}
          placeholder="Example title..."
        />
        <Text style={tw("text-center font-semibold mb-2")}>
          Добавить группы
        </Text>
        <FlatList
          data={groups.sort((prev, next) => prev.name.localeCompare(next.name))}
          scrollEnabled
          style={tw("max-h-[200px]")}
          renderItem={({ item, index }) => (
            <View>
              <CheckBox
                key={index}
                title={item.name}
                checked={selectedGroups.some(
                  (group) => group.groupId === item.groupId
                )}
                onPress={() => toggleGroup(item)}
                containerStyle={tw("")}
              />
            </View>
          )}
        />
        <FlatList 
          data={teachers.sort((prev, next) => prev.name.localeCompare(next.name))}
          scrollEnabled
          style={tw('')}
          renderItem={({item, index}) => (
            <View>
              <CheckBox 
                key={index}
                title={`${item.name} ${item.female}`}
                checked={false}
                onPress={() => }
                containerStyle={tw("")}
              />
            </View>
          )}
        />

        <Button title="Добавить" callback={addDiscipline} />
      </Card>
    </View>
  );
};

export default AddDisciplineForm;
