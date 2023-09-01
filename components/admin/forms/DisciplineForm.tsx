import React, { useState } from "react";

import { Text, View } from "react-native";

import { Card, Input } from "@rneui/themed";
import { addDoc, updateDoc } from "firebase/firestore";

import { useFilteredTeachers, useInstitutes } from "../../../hooks/login";
import { Institute, Teacher } from "../../../typings";
import { DB_PATHS } from "../../../typings/enums";
import { DOCS, DisciplinePatcher, createCollection, isEmpty } from "../../../utils";
import { Button } from "../../Button";
import { CheckListMulitple, CheckListSingle } from "../checklist";

/* мы подгружаем все институты, после чего, выбираем один
 * подгружаем всех преподов, которые подключены к этому институту
 * и опционально подключаем к этой дисциплине преподователя(ей)
 */

export function DisciplineForm() {
   const [disciplineName, setDisciplineName] = useState<string>("");

   const [selectedInstitute, setSelectedInstitute] = useState<Institute>(null);
   const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);

   const { institutes } = useInstitutes();

   const { teachers, loading: TLoading } = useFilteredTeachers(selectedInstitute);

   const addDiscipline = async () => {
      if (isEmpty(disciplineName) || isEmpty(selectedInstitute)) {
         return;
      }

      const FBDiscipline = DisciplinePatcher.toApiData({
         id: "",
         name: disciplineName,
         instituteId: selectedInstitute.id,
      });

      await addDoc(createCollection(DB_PATHS.DISCIPLINES), {
         ...FBDiscipline,
      }).then(async (response) => {
         if (!isEmpty(teachers)) {
            await Promise.all(
               teachers.map(async (teacher) => {
                  await updateDoc(DOCS.CREATE_DOC(DB_PATHS.USERS, teacher.id), {
                     disciplines: [...teacher.disciplinesIds, response.id],
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
               placeholder="Технологии ИИ..."
            />
            {/* Institute CheckList */}
            <CheckListSingle
               title="Выбрать институт"
               list={institutes}
               selectedItem={selectedInstitute}
               previewText={selectedInstitute?.shortName}
               setSelectedItem={setSelectedInstitute as (institute: Institute) => void}
            />
            <Card.Divider />
            {/* Teachers CheckList... */}
            {selectedInstitute && !TLoading && (
               <>
                  <CheckListMulitple
                     title="Добавить преподавателей"
                     list={teachers}
                     selectedList={selectedTeachers}
                     setList={setSelectedTeachers as (list: Teacher[]) => void}
                  />
                  {selectedTeachers.map((teacher) => (
                     <Text key={teacher.id}>{teacher.name}</Text>
                  ))}
               </>
            )}

            <Button title="Добавить" callback={addDiscipline} />
         </Card>
      </View>
   );
}
