import React from "react";

import { FlatList } from "react-native";

import { Card } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

import { useTimetable } from "../../../../hooks/admin/useTimetable";
import { useGroups, useInstitutes } from "../../../../hooks/login";
import { Day, Group, Institute } from "../../../../typings";
import { LFilter } from "../../../../typings/enums";
import { isEmpty } from "../../../../utils";
import { Button } from "../../../Button";
import { CheckListSingle } from "../../checklist/CheckListSingle";
import { TimeTableCard } from "./TimeTableCard";

const days: Day[] = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

export function TimetableForm() {
   const tw = useTailwind();

   const {
      timetable,
      institute,
      teachers,
      disciplines,
      group,
      loading,
      loadTimetable,
      handleGroup,
      handleInstitute,
      handleTimetable,
   } = useTimetable();

   // const [loading, setLoading] = useState<boolean>(false);

   const { institutes } = useInstitutes();
   const { groups } = useGroups([institute], LFilter.GROUPS);

   // TODO разобраться с логикой, происходит постоянный ререндер

   return (
      <Card>
         <Card.Title>Добавить расписание</Card.Title>
         <CheckListSingle
            title="Выбрать институт"
            list={institutes}
            selectedItem={institute}
            previewText={institute?.shortName}
            setSelectedItem={(item) => {
               handleInstitute(item as Institute);
               handleGroup(null);
            }}
         />
         {!isEmpty(institute) && (
            <CheckListSingle
               title="Выбрать группу"
               list={groups}
               selectedItem={group}
               previewText={group?.name}
               setSelectedItem={handleGroup as (item: Group) => void}
            />
         )}
         {/* TODO разобраться с логикой и сделать более грамотно  */}
         {!isEmpty(institute) && !isEmpty(group) && (
            <FlatList
               data={days}
               style={tw("max-h-[350px] mb-4")}
               renderItem={({ item: day, index }) => (
                  <TimeTableCard
                     key={index}
                     dayName={day}
                     timetable={timetable}
                     dayIndex={index}
                     handleTimetable={handleTimetable}
                  />
               )}
            />
         )}
         {!isEmpty(group) && !isEmpty(institute) ? (
            <Button title="Загрузить расписание" callback={loadTimetable} disabled={loading} />
         ) : null}
      </Card>
   );
}
