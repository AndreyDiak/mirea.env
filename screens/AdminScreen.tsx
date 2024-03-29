import React, { useState } from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { Card } from "@rneui/themed";
import { signOut } from "firebase/auth";
import { useTailwind } from "tailwind-rn/dist";

import { DisciplineForm, GroupForm, InstituteForm, TimetableForm } from "../components";
import { auth } from "../firebase";
import { useAdminMode } from "../hooks/admin";
import { ADMIN_MODE } from "../typings/enums";

const modeToComponentMap: Record<ADMIN_MODE, JSX.Element> = {
   [ADMIN_MODE.DISCIPLINE]: <DisciplineForm />,
   [ADMIN_MODE.GROUP]: <GroupForm />,
   [ADMIN_MODE.INSTITUTE]: <InstituteForm />,
   [ADMIN_MODE.TIMETABLE]: <TimetableForm />,
};

export function AdminScreen() {
   const tw = useTailwind();

   const [isMenuVisible, setIsMenuVisible] = useState(true);

   const { mode, close, open } = useAdminMode();

   const openForm = (newMode: ADMIN_MODE) => {
      setIsMenuVisible(false);
      open(newMode);
   };

   const closeForm = () => {
      setIsMenuVisible(true);
      close();
   };

   const renderForm = () => {
      if (!mode) {
         return null;
      }
      return modeToComponentMap[mode];
   };

   return (
      <View style={tw("pt-10 px-4 flex flex-col")}>
         {/* Screen title */}
         <View style={tw("flex flex-row items-center text-lg justify-between")}>
            <Text style={tw("my-2 text-center text-xl font-semibold")}>Панель администратора</Text>
            <TouchableOpacity onPress={() => signOut(auth)}>
               <Text style={tw("underline text-blue-400 font-bold")}>Выйти</Text>
            </TouchableOpacity>
         </View>

         {/* Variants */}
         <View>
            <Card>
               <View style={tw("flex flex-row justify-between items-center mb-2")}>
                  <View>
                     <Text style={tw("text-lg")}>Список возможностей</Text>
                  </View>
                  {!isMenuVisible && (
                     <TouchableOpacity onPress={closeForm}>
                        <Text style={tw("text-blue-400")}>Открыть</Text>
                     </TouchableOpacity>
                  )}
               </View>

               {isMenuVisible && (
                  <View>
                     <Card.Divider />
                     <View style={tw("mb-2")}>
                        <TouchableOpacity
                           onPress={() => {
                              openForm(ADMIN_MODE.TIMETABLE);
                           }}
                        >
                           <Text style={tw("text-blue-400")}>Добавить расписание</Text>
                        </TouchableOpacity>
                     </View>
                     <View style={tw("mb-2")}>
                        <TouchableOpacity
                           onPress={() => {
                              openForm(ADMIN_MODE.DISCIPLINE);
                           }}
                        >
                           <Text style={tw("text-blue-400")}>Добавить дисциплину</Text>
                        </TouchableOpacity>
                     </View>
                     <View style={tw("mb-2")}>
                        <TouchableOpacity
                           onPress={() => {
                              openForm(ADMIN_MODE.GROUP);
                           }}
                        >
                           <Text style={tw("text-blue-400")}>Добавить группу</Text>
                        </TouchableOpacity>
                     </View>
                     <View style={tw("mb-2")}>
                        <TouchableOpacity
                           onPress={() => {
                              openForm(ADMIN_MODE.INSTITUTE);
                           }}
                        >
                           <Text style={tw("text-blue-400")}>Добавить институт</Text>
                        </TouchableOpacity>
                     </View>
                  </View>
               )}
            </Card>
         </View>
         {/* Forms */}
         <View style={tw("max-h-[350px]")}>{renderForm()}</View>
      </View>
   );
}
