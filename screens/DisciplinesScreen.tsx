import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import { useSelector } from "react-redux";
import { getUser } from "../features/userSlice";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import DisciplineCard from "../components/discipline/DisciplineCard";

type Props = {};

const DisciplinesScreen = (props: Props) => {
  const tw = useTailwind();
  const user = useSelector(getUser);

  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  useEffect(() => {
    const getData = async () => {
      if (user?.type === "student") {
        // get our group id...
        const groupQuery = query(
          collection(db, "groups"),
          where("name", "==", user.group)
        );
        const groupSnap = await getDocs(groupQuery);
        const groupId = groupSnap.docs[0].id;
        // find all disciplines where there is our group...
        const disciplinesQuery = query(
          collection(db, "disciplines"),
          where("groups", "array-contains", groupId)
        );
        const disciplinesSnap = await getDocs(disciplinesQuery);

        const disciplines = disciplinesSnap.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setDisciplines(disciplines);
      } else {
        setDisciplines(user?.disciplines as Discipline[]);
      }
    };
    getData();
    // console.log("update");
  }, [user]);

  return (
    <View style={tw("py-8 h-full")}>
      <View>
        <Text style={tw("text-center font-bold text-xl text-gray-800 mb-2")}>
          Ваши дисциплины
        </Text>
      </View>
      <ScrollView>
        {disciplines && disciplines.map((discipline) => (
          <DisciplineCard key={discipline.id} discipline={discipline} />
        ))}
      </ScrollView>
    </View>
  );
};

export default DisciplinesScreen;
