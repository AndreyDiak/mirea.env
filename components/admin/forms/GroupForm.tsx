import React, { useState } from "react";

import { Text, View } from "react-native";

import { Card, Input } from "@rneui/themed";
import { addDoc } from "firebase/firestore";
import { useTailwind } from "tailwind-rn/dist";

import { useInstitutes } from "../../../hooks/login";
import type { Institute } from "../../../typings";
import { DBQueries } from "../../../typings/enums";
import { createCollection } from "../../../utils";
import { Button } from "../../Button";
import { CheckListSingle } from "../checklist/CheckListSingle";

export function GroupForm() {
   const [groupName, setGroupName] = useState("");
   const [selectedInstitute, setSelectedInstitute] = useState<Institute>(null);
   const [loading, setLoading] = useState(false);
   const { institutes } = useInstitutes();

   const tw = useTailwind();

   const addGroup = async () => {
      if (groupName === "") {
         return;
      }
      setLoading(true);
      await addDoc(createCollection(DBQueries.GROUPS), {
         name: groupName,
         instituteId: selectedInstitute.id,
      }).then(() => {
         setGroupName("");
         setSelectedInstitute(null);
      });
      setLoading(false);
   };

   return (
      <View>
         <Card>
            <Card.Title>Добавить группу</Card.Title>
            <CheckListSingle
               title="Выбрать институт"
               list={institutes}
               selectedItem={selectedInstitute}
               setSelectedItem={setSelectedInstitute as (item: Institute) => void}
            />
            {!!selectedInstitute && (
               <>
                  <Text style={tw("text-center mb-4")}>
                     Институт: <Text style={tw("font-bold")}>{selectedInstitute.shortName}</Text>
                  </Text>
                  <Input
                     label="Название группы"
                     value={groupName}
                     onChangeText={setGroupName}
                     placeholder="group_name"
                  />
               </>
            )}

            <Button title="Добавить" callback={addGroup} disabled={loading} />
         </Card>
      </View>
   );
}
