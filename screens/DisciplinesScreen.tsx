import React from "react";

import { ScrollView, Text, View } from "react-native";

import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { DisciplineCard, Loader, ScreenTemplate } from "../components";
import { selectUser } from "../features/userSlice";
import { useDisciplines } from "../hooks";
import { returnAppThemeText } from "../utils";

export function DisciplinesScreen() {
   const tw = useTailwind();
   const user = useSelector(selectUser);

   const { disciplines, loading } = useDisciplines();

   if (loading) {
      return <Loader text="Загрузка дисциплин" theme={user?.theme || "blue"} />;
   }

   return (
      <ScreenTemplate>
         <View style={tw("py-8 h-full")}>
            <View>
               <Text
                  style={[
                     tw("text-center font-bold text-xl mb-2"),
                     {
                        color: returnAppThemeText(user.appTheme),
                     },
                  ]}
               >
                  Ваши дисциплины
               </Text>
            </View>
            <ScrollView>
               {disciplines.map((discipline) => (
                  <DisciplineCard key={discipline.id} discipline={discipline} />
               ))}
            </ScrollView>
         </View>
      </ScreenTemplate>
   );
}
