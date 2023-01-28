import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import { useSelector } from "react-redux";
import { getUser } from "../features/userSlice";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { CenteredText, DisciplineCard } from "../components";
import { returnHexCode } from "../utils/returnHexCodes";
import { Icon } from "@rneui/themed";
import { getDataById } from "../api/queries/getDataById";
import { DBQueries } from "../typings/enums";
import { getAllDataWithFilter } from "../api/queries/getAllDataWIthFilter";

export const DisciplinesScreen = () => {
  const tw = useTailwind();
  const user = useSelector(getUser);

  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  useEffect(() => {
    const getData = async () => {
      if (user.type === "student") {
        // get our group id...
        const group = await getDataById<Group>(user.groupId, DBQueries.GROUPS);
        const disciplines = await getAllDataWithFilter<Discipline>(
          DBQueries.DISCIPLINES,
          "instituteId",
          group.instituteId
        );
        setDisciplines(disciplines);
      } else {
        setDisciplines(user?.disciplines as Discipline[]);
      }
    };
    getData();
    // console.log("update");
  }, [user]);

  if (!disciplines) {
    return (
      <CenteredText
        text={"Загрузка"}
        Icon={
          <Icon
            name="pending"
            type="material"
            color={returnHexCode(user?.theme as AppTheme)}
            size={30}
          />
        }
      />
    );
  }

  return (
    <View style={tw("py-8 h-full")}>
      <View>
        <Text style={tw("text-center font-bold text-xl text-gray-800 mb-2")}>Ваши дисциплины</Text>
      </View>
      <ScrollView>
        {disciplines.map((discipline) => (
          <DisciplineCard key={discipline.id} discipline={discipline} />
        ))}
      </ScrollView>
    </View>
  );
};
