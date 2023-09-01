import React from "react";

import { FlatList, Text, View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { DisciplineCard, FullScreenError, Loader, ScreenTemplate } from "../components";
import { useDisciplines } from "../features/hooks";
import { useTheme } from "../hooks";
import { isEmpty } from "../utils";

export function DisciplinesScreen() {
   const tw = useTailwind();

   const { disciplines, loading } = useDisciplines();

   const { APP_THEME_TEXT, THEME } = useTheme();

   if (loading) {
      return <Loader text="Загрузка дисциплин" theme={THEME} />;
   }

   if (isEmpty(disciplines)) {
      return <FullScreenError text="К вашему институту нет привязанных дисциплин" theme={THEME} />;
   }

   return (
      <ScreenTemplate>
         <View style={tw("py-8 h-full")}>
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

            <FlatList
               data={disciplines}
               renderItem={({ item: discipline }) => (
                  <DisciplineCard key={discipline.id} discipline={discipline} />
               )}
            />
         </View>
      </ScreenTemplate>
   );
}
