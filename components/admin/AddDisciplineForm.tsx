import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Card, CheckBox, Icon, Input } from "@rneui/themed";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useTailwind } from "tailwind-rn/dist";
import Button from "../Button";
import CheckListMulitple from "./CheckListMulitple";

type Props = {};
type ToggleItem = {
  type: "group" | "teacher";
  item: Group | Teacher;
  selected: (Group | Teacher)[];
  setSelected: (selected: (Group | Teacher)[]) => void;
};
const AddDisciplineForm = (props: Props) => {
  const tw = useTailwind();

  const [disciplineTitle, setDisciplineTitle] = useState("");

  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);

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
      setTeachers(teachers as Teacher[]);
    };
    getGroups();
    getTeachers();
  }, []);

  const addDiscipline = async () => {
    if (
      disciplineTitle === "" ||
      selectedGroups.length === 0 ||
      selectedTeachers.length === 0
    ) {
      return;
    }
    await addDoc(collection(db, "disciplines"), {
      groups: selectedGroups.map(group => group.groupId),
      title: disciplineTitle,
      teachers: selectedTeachers.map(teacher => teacher.userId),
    }).then(() => {
      console.log("discipline added");
      setDisciplineTitle("");
      setSelectedGroups([]);
      setSelectedTeachers([]);
    });
  };

  return (
    <View>
      <Card>
        <Card.Title>???????????????? ????????????????????</Card.Title>
        <Input
          label="???????????????? ????????????????????"
          value={disciplineTitle}
          onChangeText={setDisciplineTitle}
          placeholder="Example title..."
        />
        {/* Groups CheckList... */}
        <CheckListMulitple
          title="???????????????? ????????????"
          attr="groupId"
          list={groups}
          selectedList={selectedGroups}
          setList={setSelectedGroups}
        />

        <Card.Divider />
        {/* Teachers CheckList... */}
        <CheckListMulitple
          title="???????????????? ??????????????"
          attr="userId"
          list={teachers}
          selectedList={selectedTeachers}
          setList={setSelectedTeachers}
        />

        <Button title="????????????????" callback={addDiscipline} />
      </Card>
    </View>
  );
};

export default AddDisciplineForm;
