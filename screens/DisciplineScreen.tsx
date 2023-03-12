import React, { useLayoutEffect, useState } from "react";

import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { Error, Loader, MaterialCard, MaterialForm } from "../components";
import { selectUser } from "../features/userSlice";
import { useMaterials } from "../hooks";
import { DisciplineScreenNavigatorProp, RootStackParamList } from "../typings";
import { UType } from "../typings/enums";
import { isEmpty, returnHexCode } from "../utils";

type DisciplineScreenRouteProp = RouteProp<RootStackParamList, "Discipline">;

export function DisciplineScreen() {
   const [isFormVisible, setIsFormVisible] = useState(false);

   const tw = useTailwind();
   const navigation = useNavigation<DisciplineScreenNavigatorProp>();
   const user = useSelector(selectUser);

   const {
      params: { discipline },
   } = useRoute<DisciplineScreenRouteProp>();

   const { materials, loading } = useMaterials(discipline.id);

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: discipline.name,
      });
   }, [discipline, navigation]);

   const isStudent = user.type === UType.STUDENT;

   if (loading) {
      return <Loader text="Загрузка материалов" theme={user.theme} />;
   }

   if (isEmpty(materials) && !loading && isStudent) {
      return <Error text="Тут пока нет материалов..." theme={user.theme} />;
   }

   return (
      <SafeAreaView style={tw("flex flex-col px-4 relative")}>
         {!isStudent && (
            <View style={tw("")}>
               <TouchableOpacity
                  style={tw("flex flex-row justify-end")}
                  onPress={() => setIsFormVisible(!isFormVisible)}
               >
                  <View style={tw("flex flex-row items-center")}>
                     <Text style={{ color: returnHexCode(user.theme) }}>
                        {isFormVisible ? "Закрыть" : "Добавить материалы"}
                     </Text>
                     <Icon
                        name={!isFormVisible ? "expand-more" : "expand-less"}
                        type="material"
                        color={returnHexCode(user.theme)}
                        size={25}
                     />
                  </View>
               </TouchableOpacity>
               {isFormVisible && (
                  <MaterialForm disciplineId={discipline.id} setIsFormVisible={setIsFormVisible} />
               )}
            </View>
         )}
         {/* рендрим все материалы */}
         {!isFormVisible && (
            <FlatList
               style={tw("")}
               data={materials.reverse()}
               scrollEnabled
               showsVerticalScrollIndicator={false}
               renderItem={({ item: material }) => {
                  return (
                     <MaterialCard
                        key={material.id}
                        material={material}
                        userId={user.id}
                        userType={user.type}
                        userTheme={user.theme}
                     />
                  );
               }}
            />
         )}
      </SafeAreaView>
   );
}
