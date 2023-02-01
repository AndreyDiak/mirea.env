import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import { selectUserTheme } from "../../features/userSlice";

import { useAddUserData } from "../../hooks";
import { UType } from "../../typings/enums";
import { returnHexCode } from "../../utils/returnHexCodes";

export const ProfileAdditional: React.FC = React.memo(() => {
  const tw = useTailwind();
  const theme = useSelector(selectUserTheme);

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
});
