import React, { useState } from "react";

import { View } from "react-native";

import { Card, Input } from "@rneui/themed";
import { addDoc, updateDoc } from "firebase/firestore";
import { useTailwind } from "tailwind-rn/dist";

import { useInstitutes } from "../../../hooks/login";
import { useTeachers } from "../../../hooks/login/useTeachers";
import { Institute, Teacher } from "../../../typings";
import { DBQueries } from "../../../typings/enums";
import { DOCS, createCollection } from "../../../utils";
import { Button } from "../../Button";
import { CheckListMulitple } from "../CheckListMulitple";
import { CheckListSingle } from "../CheckListSingle";

/* мы подгружаем все институты, после чего, выбираем один
 * подгружаем всех преподов, которые подключены к этому институту
 * и опционально подключаем к этой дисциплине преподователя(ей)
 */

export function DisciplineForm() {
   const [disciplineName, setDisciplineName] = useState<string>("");

   const [selectedInstitute, setSelectedInstitute] = useState<Institute>(null);
   const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);

   const { institutes, loading: ILoading } = useInstitutes();

   const { teachers, loading: TLoading } = useTeachers(selectedInstitute);

   const addDiscipline = async () => {
      if (disciplineName === "" || selectedInstitute === null) {
         return;
      }
      await addDoc(createCollection(DBQueries.DISCIPLINES), {
         name: disciplineName,
         instituteId: "",
      }).then(async (response) => {
         if (teachers.length !== 0) {
            await Promise.all(
               teachers.map(async (teacher) => {
                  await updateDoc(DOCS.CREATE_DOC(DBQueries.USERS, teacher.id), {
                     disciplines: [...teacher.disciplines, response.id],
                  });
               }),
            );
         }
         setDisciplineName("");
         setSelectedTeachers([]);
      });
   };

   return (
      <View>
         <Card>
            <Card.Title>Добавить дисциплину</Card.Title>
            <Input
               label="Название дисциплины"
               value={disciplineName}
               onChangeText={setDisciplineName}
               placeholder="Example title..."
            />
            {/* Institute CheckList */}
            <CheckListSingle
               title={`Выбрать институт ${
                  selectedInstitute ? `(${selectedInstitute?.shortName})` : ""
               }`}
               list={institutes}
               selectedItem={selectedInstitute}
               setSelectedItem={setSelectedInstitute as (institute: Institute) => void}
            />
            {/* Groups CheckList... */}
            <Card.Divider />
            {/* Teachers CheckList... */}
            {selectedInstitute && !TLoading && (
               <>
                  {/* <Text style={tw("mb-2 text-center")}>{selectedInstitute.shortName}</Text> */}
                  <CheckListMulitple
                     title="Добавить учителей"
                     list={teachers}
                     selectedList={selectedTeachers}
                     setList={setSelectedTeachers as (list: Teacher[]) => void}
                  />
               </>
            )}

            <Button title="Добавить" callback={addDiscipline} />
         </Card>
      </View>
   );
}
