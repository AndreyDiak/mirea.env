import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import React, { useLayoutEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { Error, Loader, MaterialCard, MaterialForm } from "../components";

import { selectUser } from "../features/userSlice";
import { useMaterials } from "../hooks";
import { DisciplineScreenNavigatorProp, RootStackParamList } from "../typings";
import { UType } from "../typings/enums";
import { returnHexCode } from "../utils";

type DisciplineScreenRouteProp = RouteProp<RootStackParamList, "Discipline">;

export const DisciplineScreen = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const tw = useTailwind();
  const navigation = useNavigation<DisciplineScreenNavigatorProp>();
  const user = useSelector(selectUser);

  const {
    params: { discipline },
  } = useRoute<DisciplineScreenRouteProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: discipline.name,
    });
  }, [discipline]);

  const { materials, loading, error } = useMaterials(discipline.id);

  if (loading) {
    return <Loader text={"Загрузка материалов"} theme={user?.theme} />;
  }

  if (materials.length === 0 && !loading && user.type === UType.STUDENT) {
    return <Error text={"Тут пока нет материалов..."} theme={user?.theme} />;
  }

  return (
    <SafeAreaView style={tw("flex flex-col px-4")}>
      {user?.type === "teacher" && (
        <View style={tw("")}>
          <TouchableOpacity
            style={tw("flex flex-row justify-end")}
            onPress={() => setIsFormVisible(!isFormVisible)}
          >
            <View style={tw("flex flex-row items-center")}>
              <Text style={{ color: returnHexCode(user?.theme || "blue") }}>
                {isFormVisible ? "Закрыть" : "Добавить материалы"}
              </Text>
              <Icon
                name={!isFormVisible ? "expand-more" : "expand-less"}
                type="material"
                color={returnHexCode(user?.theme || "blue")}
                size={25}
              />
            </View>
          </TouchableOpacity>
          {isFormVisible && (
            <MaterialForm disciplineId={discipline.id} setIsFormVisible={setIsFormVisible} />
          )}
        </View>
      )}
      <View>
        <FlatList
          style={tw("")}
          data={materials.reverse()}
          scrollEnabled
          showsVerticalScrollIndicator={false}
          renderItem={({ item: material, index }) => {
            return (
              <MaterialCard
                key={material.id}
                material={material}
                userId={user?.userId}
                userType={user?.type}
                userTheme={user?.theme}
              />
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};
