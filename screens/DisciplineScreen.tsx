import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import React, { useLayoutEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { Material, MaterialForm, CenteredText } from "../components";

import { getUser } from "../features/userSlice";
import { useMaterials } from "../hooks/";
import { returnHexCode } from "../utils/returnHexCodes";
type Props = {};

type DisciplineScreenRouteProp = RouteProp<RootStackParamList, "Discipline">;

export const DisciplineScreen = () => {
  const [initialMaterials, setInitialMaterials] = useState<Material[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const tw = useTailwind();
  const navigation = useNavigation<DisciplineScreenNavigatorProp>();
  const user = useSelector(getUser);

  const {
    params: { discipline },
  } = useRoute<DisciplineScreenRouteProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: discipline.name,
    });
  }, [discipline]);

  const { initialMaterials: materials } = useMaterials(discipline.id);

  // const materialsQuery = query(
  //   collection(db, "materials"),
  //   where("disciplineId", "==", discipline.id),
  //   orderBy("timestamp")
  // );

  // const unsubscribe = onSnapshot(materialsQuery, async (snapshot) => {
  //   const materials = await Promise.all(
  //     snapshot.docs.map(async (m) => {
  //       const material = await getMaterialById(m.id);
  //       return material;
  //     })
  //   );

  //   if (materials.length !== initialMaterials.length) {
  //     setInitialMaterials(materials);
  //   }
  // });

  if (!materials.length && user.type === "student") {
    return (
      <CenteredText
        text={"Тут пока нет материалов..."}
        Icon={
          <Icon
            name="inventory"
            type="material"
            color={returnHexCode(user?.theme as AppTheme)}
            size={30}
          />
        }
      />
    );
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
              <Text style={{ color: returnHexCode(user.theme as AppTheme) }}>
                {isFormVisible ? "Закрыть" : "Добавить материалы"}
              </Text>
              <Icon
                name={!isFormVisible ? "expand-more" : "expand-less"}
                type="material"
                color={returnHexCode(user.theme as AppTheme)}
                size={25}
              />
            </View>
          </TouchableOpacity>
          {isFormVisible && (
            <MaterialForm
              disciplineId={discipline.id}
              setIsFormVisible={setIsFormVisible}
            />
          )}
        </View>
      )}
      <View>
        <FlatList
          style={tw("")}
          data={materials.reverse()}
          scrollEnabled
          showsVerticalScrollIndicator={false}
          renderItem={(item) => {
            return (
              <Material
                material={item.item}
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
