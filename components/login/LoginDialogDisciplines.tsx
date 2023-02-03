import { CheckBox } from "@rneui/themed";
import React from "react";
import { FlatList, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import { selectUserDisciplines, setDisciplines } from "../../features/authSlice";
import { useDisciplines, useInstitutes } from "../../hooks/login";
import type { Discipline } from "../../typings";
import { LFilter } from "../../typings/enums";
import { returnHexCode } from "../../utils/returnHexCodes";
import { Error, Loader } from "../common";

interface Props {
  filter: LFilter;
}

export const LoginDialogDisciplines: React.FC<Props> = React.memo(({ filter }) => {
  const tw = useTailwind();
  const dispatch = useDispatch();
  const { institutes, loading: ILoading } = useInstitutes();
  const { disciplines, loading: DLoading } = useDisciplines(institutes, filter);
  const myDisciplines = useSelector(selectUserDisciplines);
  const toggleMyDisciplines = (discipline: Discipline) => {
    dispatch(setDisciplines({ discipline }));
  };

  const renderData = () => {
    if (ILoading || DLoading) {
      return <Loader text="Загрузка доступных дисциплин" theme="blue" />;
    }
    const totalDisciplinesCount = !!disciplines
      ? Object.values(disciplines).reduce((total, d) => total + d.length, 0)
      : 0;

    if (totalDisciplinesCount === 0) {
      return <Error text={"Дисциплины не найдены"} theme="blue" />;
    }
    return (
      <FlatList
        data={Object.keys(disciplines)}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        renderItem={({ item: IName, index }) => {
          if (disciplines[IName].length > 0)
            return (
              <View key={index} style={tw("mb-1")}>
                <View style={{ backgroundColor: returnHexCode("blue") }}>
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
        }}
      />
    );
  };

  return <View style={tw("max-h-[350px]")}>{renderData()}</View>;
});
