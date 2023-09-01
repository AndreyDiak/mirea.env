import React, { useMemo } from "react";

import { FlatList, Text, View } from "react-native";

import { CheckBox } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUserDisciplines, setDisciplines } from "../../features/slices/authSlice";
import { useFilteredDisciplines, useInstitutes } from "../../hooks/login";
import { COLORS_400, Discipline } from "../../typings";
import { LFilter, USER_THEME } from "../../typings/enums";
import { returnHexCode } from "../../utils/returnHexCodes";
import { FullScreenError, FullScreenLoader } from "../common";

interface Props {
   filter: LFilter;
}

export const LoginDialogDisciplines: React.FC<Props> = React.memo(({ filter }) => {
   const tw = useTailwind();
   const dispatch = useDispatch();

   const { institutes, loading: ILoading } = useInstitutes();
   const { disciplines, loading: DLoading } = useFilteredDisciplines(institutes, filter);
   const myDisciplines = useSelector(selectUserDisciplines);

   const toggleMyDisciplines = (discipline: Discipline) => {
      dispatch(setDisciplines({ discipline }));
   };

   const totalDisciplinesCount = useMemo(
      () => (disciplines ? Object.values(disciplines).reduce((total, d) => total + d.length, 0) : 0),
      [disciplines],
   );

   const renderData = () => {
      if (ILoading || DLoading) {
         return <FullScreenLoader text="Загрузка доступных дисциплин" theme={COLORS_400.BLUE} />;
      }

      if (totalDisciplinesCount === 0) {
         return <FullScreenError text="Дисциплины не найдены" theme={COLORS_400.BLUE} />;
      }

      return (
         <FlatList
            data={Object.keys(disciplines)}
            scrollEnabled
            showsVerticalScrollIndicator={false}
            renderItem={({ item: IName, index }) => {
               if (disciplines[IName].length > 0) {
                  return (
                     <View key={index} style={tw("mb-1")}>
                        <View style={{ backgroundColor: returnHexCode(USER_THEME.BLUE) }}>
                           <Text style={tw("text-center py-2 text-white font-bold")}>{IName}</Text>
                        </View>

                        <FlatList
                           data={disciplines[IName]}
                           scrollEnabled
                           showsVerticalScrollIndicator={false}
                           renderItem={({ item: discipline }) => {
                              const isSelected = myDisciplines.some((myD) => myD === discipline.id);

                              return (
                                 <CheckBox
                                    key={index}
                                    title={discipline.name}
                                    checked={isSelected}
                                    onPress={() => toggleMyDisciplines(discipline)}
                                 />
                              );
                           }}
                        />
                     </View>
                  );
               }
               return null;
            }}
         />
      );
   };

   return <View style={tw("max-h-[350px]")}>{renderData()}</View>;
});
