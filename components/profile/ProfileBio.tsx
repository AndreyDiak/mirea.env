import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { useAddUserData } from "../../hooks";
import type { AppTheme } from "../../typings";
import { UType } from "../../typings/enums";
import { returnHexCode } from "../../utils/returnHexCodes";

interface Props {
   name: string;
   female: string;
   theme: AppTheme;
}

export const ProfileBio: React.FC<Props> = React.memo(({ theme }) => {
   const tw = useTailwind();

   const { groupName, disciplinesList, loading, uType, institutes } = useAddUserData();

   const renderLoadingItem = (item: string) => {
      if (loading) {
         return <Text style={tw("text-xl")}>Загрузка...</Text>;
      }
      return <Text style={tw("text-xl font-bold text-white")}>{item}</Text>;
   };

   const renderDisciplinesList = () => {
      if (loading) {
         return <Text style={tw("text-[18px]")}>Загрузка</Text>;
      }
      return (
         <TouchableOpacity>
            <Text style={[tw("text-[18px] font-bold"), { color: returnHexCode(theme) }]}>
               ({disciplinesList.length}) {disciplinesList.length < 5 ? "Предмета" : "Предметов"}
            </Text>
         </TouchableOpacity>
      );
   };

   const renderData = () => {
      if (uType === UType.STUDENT) {
         return (
            <View style={tw("")}>
               <View style={tw("flex flex-row  items-center justify-between")}>
                  <Text style={tw("text-white font-semibold text-lg")}>Институт</Text>
                  {renderLoadingItem(institutes[0])}
               </View>
               <View style={tw("flex flex-row w-full items-center justify-between")}>
                  <Text style={tw("text-white font-semibold text-lg")}>Группа</Text>
                  {renderLoadingItem(groupName)}
               </View>
            </View>
         );
      }
      return (
         <View>
            <Text style={tw("mb-2 text-gray-800")}>Вы вёдете</Text>
            {renderDisciplinesList()}
         </View>
      );
   };

   return (
      <View style={tw("px-2 w-full mb-4")}>
         {/* Group or Disciplines */}
         {renderData()}
      </View>
   );
});
