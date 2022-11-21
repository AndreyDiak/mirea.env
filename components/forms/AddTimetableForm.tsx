import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Card } from "@rneui/themed";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";
import CheckListSingle from "../CheckListSingle";

type Props = {};

const AddTimetableForm = (props: Props) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

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
      </Card>
    </View>
  );
};

export default AddTimetableForm;
