import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Card, CheckBox, Input } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";
import Button from "../Button";
import CheckListSingle from "../CheckListSingle";

type Props = {};

const AddGroupForm = (props: Props) => {
  const tw = useTailwind();

  const [groupName, setGroupName] = useState("");
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [activeInstitute, setActiveInstitute] = useState<Institute | null>(
    null
  );

  useEffect(() => {
    const getInstitutes = async () => {
      const q = query(collection(db, "institute"));
      const snap = await getDocs(q);
      const institutes = snap.docs.map((insitute) => ({
        ...insitute.data(),
        instituteId: insitute.id,
      }));
      setInstitutes(institutes as Institute[]);
    };
    getInstitutes();
  }, []);

  const addGroup = async () => {
    if (groupName === "" || !activeInstitute) {
      return;
    }

    await addDoc(collection(db, "groups"), {
      name: groupName,
      instituteId: activeInstitute.instituteId,
    }).then(() => {
      console.log("group added");
      setGroupName("");
      setActiveInstitute(null);
    });
  };

  return (
    <View>
      <Card>
        <Card.Title>Добавить группу</Card.Title>
        <Input
          label="Название группы"
          value={groupName}
          onChangeText={setGroupName}
          placeholder="Example name..."
        />
        <CheckListSingle
          attr="instituteId"
          title="Выбрать институт"
          list={institutes}
          selectedItem={activeInstitute}
          setSelectedItem={setActiveInstitute}
        />
        <Button title="Добавить" callback={addGroup} />
      </Card>
    </View>
  );
};

export default AddGroupForm;
