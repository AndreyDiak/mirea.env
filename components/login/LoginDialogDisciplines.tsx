import { CheckBox } from "@rneui/themed";
import React from "react";
import { FlatList, View, Text } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { returnHexCode } from "../../utils/returnHexCodes";
import { Error, Loader } from "../common";

interface Props {
  disciplines: Record<string, Discipline[]>;
  myDisciplines: string[];
  isLoading: boolean;
  setMyDisciplines: (myDisciplines: string[]) => void;
}

export const LoginDialogDisciplines: React.FC<Props> = React.memo(
  ({ disciplines, myDisciplines, setMyDisciplines, isLoading }) => {
    const tw = useTailwind();

    const toggleMyDisciplines = (discipline: Discipline, isSelected: boolean) => {
      // сохраняем только id дисциплин
      let disciplinesCopy = [...myDisciplines];
      if (!isSelected) {
        disciplinesCopy.push(discipline.id);
      } else {
        disciplinesCopy = disciplinesCopy.filter((d) => d !== discipline.id);
      }
      setMyDisciplines(disciplinesCopy);
    };

    // console.log({ isLoading });
    // console.log({ disciplines });

    const renderData = () => {
      if (isLoading) {
        return <Loader text="Загрузка доступных дисциплин" theme="blue" />;
      }
      const totalDisciplinesCount = Object.values(disciplines).reduce(
        (total, d) => total + d.length,
        0
      );
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
                          onPress={() => toggleMyDisciplines(discipline, isSelected)}
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
  }
);
