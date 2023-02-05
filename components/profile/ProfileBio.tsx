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

export const ProfileBio: React.FC<Props> = React.memo(({ name, female, theme }) => {
   const tw = useTailwind();

   const { groupName, disciplinesList, loading, uType } = useAddUserData();

   const renderGroupName = () => {
      if (loading) {
         return <Text style={tw("text-xl")}>Загрузка...</Text>;
      }
      return <Text style={tw("text-xl font-bold")}>{groupName}</Text>;
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
            <View>
               <Text style={tw("mb-2 text-gray-800")}>Ваша группа</Text>
               {renderGroupName()}
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
      <View style={tw("flex flex-row items-center justify-between flex-wrap mb-4")}>
         <View>
            <View>
               <Text style={tw("text-lg text-gray-800")}>{name}</Text>
            </View>
            <View>
               <Text style={tw("text-lg text-gray-800")}>{female}</Text>
            </View>
         </View>
         {/* Group or Disciplines */}
         {renderData()}
      </View>
   );
});
