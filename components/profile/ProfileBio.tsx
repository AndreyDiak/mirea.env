import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { useAddUserData } from "../../hooks";
import { USER_TYPE } from "../../typings/enums";

interface Props {
   openModal(): void;
}

export const ProfileBio: React.FC<Props> = React.memo(({ openModal }) => {
   const tw = useTailwind();

   const { groupName, disciplines, loading, userType, institutes } = useAddUserData();

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
         <TouchableOpacity onPress={openModal}>
            <Text style={tw("text-[18px] font-bold text-white")}>
               ({disciplines.length}) {disciplines.length < 5 ? "Предмета" : "Предметов"}
            </Text>
         </TouchableOpacity>
      );
   };

   const renderData = () => {
      if (userType === USER_TYPE.STUDENT) {
         return (
            <View>
               <View style={tw("flex flex-row items-center justify-between")}>
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
            <View style={tw("flex flex-row items-center justify-between")}>
               <Text style={tw("mb-2 text-white font-semibold text-lg")}>Вы вёдете</Text>
               {renderDisciplinesList()}
            </View>
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
