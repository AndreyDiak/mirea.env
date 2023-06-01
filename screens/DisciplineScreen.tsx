import React, { useLayoutEffect, useState } from "react";

import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { Error, Loader, MaterialCard, MaterialForm, ScreenTemplate } from "../components";
import { useMaterials } from "../features/hooks";
import { selectUser } from "../features/slices/userSlice";
import { useTheme } from "../hooks";
import type { DisciplineScreenNavigationProp, DisciplineScreenRouteProp } from "../typings";
import { USER_TYPE } from "../typings/enums";
import { isEmpty } from "../utils";

export function DisciplineScreen() {
   const [isFormVisible, setIsFormVisible] = useState(false);

   const tw = useTailwind();
   const navigation = useNavigation<DisciplineScreenNavigationProp>();
   const user = useSelector(selectUser);

   const { THEME_MAIN } = useTheme();

   const {
      params: { discipline },
   } = useRoute<DisciplineScreenRouteProp>();

   const { materials, loading } = useMaterials(discipline.id);

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: discipline.name,
         headerStyle: {},
      });
   }, [discipline, navigation, user.appTheme]);

   const isStudent = user.type === USER_TYPE.STUDENT;

   if (isEmpty(materials) && loading) {
      return <Loader text="Загрузка материалов" theme={user.theme} />;
   }

   if (isEmpty(materials) && !loading && isStudent) {
      return <Error text="Тут пока нет материалов..." theme={user.theme} />;
   }

   return (
      <ScreenTemplate>
         <SafeAreaView style={tw("flex flex-col px-4 relative")}>
            {!isStudent && (
               <View style={tw("")}>
                  <TouchableOpacity
                     style={tw("flex flex-row justify-center")}
                     onPress={() => setIsFormVisible(!isFormVisible)}
                  >
                     <View style={tw("flex flex-row items-center")}>
                        <Text style={{ color: THEME_MAIN }}>
                           {isFormVisible ? "Закрыть" : "Добавить материалы"}
                        </Text>
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
                        />
                     );
                  }}
               />
            )}
         </SafeAreaView>
      </ScreenTemplate>
   );
}
