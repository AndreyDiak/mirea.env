import React from "react";

import { Text, View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { useDisciplines } from "../../../features/hooks";
import { COLORS_THEME_MAIN_TEXT } from "../../../utils";

export function ProfileDisciplinesModal() {
   const tw = useTailwind();

   const { disciplines, loading } = useDisciplines();

   if (loading) {
      return <Text>Загрузка...</Text>;
   }

   return (
      <View style={tw("max-w-full flex flex-col")}>
         {disciplines?.map((discipline) => (
            <Text
               key={discipline.id}
               style={[
                  tw("font-semibold text-sm my-1"),
                  {
                     color: COLORS_THEME_MAIN_TEXT.LIGHT,
                  },
               ]}
            >
               {discipline.name}
            </Text>
         ))}
      </View>
   );
}
