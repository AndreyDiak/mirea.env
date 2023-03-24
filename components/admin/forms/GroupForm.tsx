import React, { useState } from "react";

import { View } from "react-native";

import { Card, Input } from "@rneui/themed";
import { addDoc } from "firebase/firestore";

import { useInstitutes } from "../../../hooks/login";
import type { Institute } from "../../../typings";
import { DB_PATHS } from "../../../typings/enums";
import { GroupPatcher, createCollection } from "../../../utils";
import { Button } from "../../Button";
import { CheckListSingle } from "../checklist/CheckListSingle";

export function GroupForm() {
   const [groupName, setGroupName] = useState("");
   const [selectedInstitute, setSelectedInstitute] = useState<Institute>(null);
   const [loading, setLoading] = useState(false);
   const { institutes } = useInstitutes();

   const addGroup = async () => {
      if (groupName === "") {
         return;
      }
      setLoading(true);
      const FBGroup = GroupPatcher.toApiData({
         id: "",
         name: groupName,
         instituteId: selectedInstitute.id,
      });
      await addDoc(createCollection(DB_PATHS.GROUPS), {
         ...FBGroup,
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
               previewText={selectedInstitute?.shortName}
               setSelectedItem={setSelectedInstitute as (item: Institute) => void}
            />
            {!!selectedInstitute && (
               <Input
                  label="Название группы"
                  value={groupName}
                  onChangeText={setGroupName}
                  placeholder="ГРУППА-01-23"
               />
            )}

            <Button title="Добавить" callback={addGroup} disabled={loading} />
         </Card>
      </View>
   );
}
