import React, { useState } from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { Card, Icon } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

import type { Lesson, Timetable } from "../../../../typings";
import { COLORS_400 } from "../../../../utils";
import { MODAL_TYPES, useGlobalModalContext } from "../../../common";
import { TimeTableModal } from "./modal/TimeTableModal";

interface Props {
   dayName: string;
   dayIndex: number;
   timetable: Timetable;
   handleTimetable: (dayIndex: number, newLessons: Lesson[]) => void;
}

export function TimeTableCard({ dayName, dayIndex, timetable, handleTimetable }: Props) {
   const tw = useTailwind();
   const [isCardVisible, setIsCardVisible] = useState(false);

   const { openModal } = useGlobalModalContext();

   const openTimetableModal = () => {
      openModal(MODAL_TYPES.SIMPLE_MODAL, {
         title: dayName,
         // eslint-disable-next-line react/no-unstable-nested-components
         children: () => (
            <TimeTableModal
               dayIndex={dayIndex}
               lessons={timetable.days[dayIndex].lessons}
               handleTimetable={handleTimetable}
            />
         ),
      });
   };

   return (
      <Card>
         <TouchableOpacity onPress={openTimetableModal}>
            <View style={tw("flex flex-row justify-between items-center")}>
               <Text>{dayName}</Text>
               <TouchableOpacity>
                  <Icon
                     name={!isCardVisible ? "expand-more" : "expand-less"}
                     color={COLORS_400.BLUE}
                     containerStyle={tw("bg-gray-50 rounded-full p-1")}
                  />
               </TouchableOpacity>
            </View>
         </TouchableOpacity>
      </Card>
   );
}
