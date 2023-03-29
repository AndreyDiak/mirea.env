import React from "react";

import { ScrollView, Text, View } from "react-native";

import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { DisciplineCard, Loader, ScreenTemplate } from "../components";
import { selectUser } from "../features/slices/userSlice";
import { useDisciplines, useTheme } from "../hooks";

export function DisciplinesScreen() {
   const tw = useTailwind();
   const user = useSelector(selectUser);

   const { disciplines, loading } = useDisciplines();

   const { APP_THEME_TEXT } = useTheme();

   if (loading) {
      return <Loader text="Загрузка дисциплин" theme={user.theme} />;
   }

   return (
      <ScreenTemplate>
         <View style={tw("py-8 h-full")}>
            <View>
               <Text
                  style={[
                     tw("text-center font-bold text-xl mb-2"),
                     {
                        color: APP_THEME_TEXT,
                     },
                  ]}
               >
                  Ваши дисциплины
               </Text>
            </View>
            <ScrollView>
               {disciplines?.map((discipline) => (
                  <DisciplineCard key={discipline.id} discipline={discipline} />
               ))}
            </ScrollView>
         </View>
      </ScreenTemplate>
   );
}
