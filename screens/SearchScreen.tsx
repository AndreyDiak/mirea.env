import React from "react";

import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { Input } from "@rneui/base";
import { Icon } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

import { Label, Loader, ScreenTemplate } from "../components";
import { SearchCard } from "../components/search/SearchCard";
import { useSearch } from "../features/hooks";
import { useTheme } from "../hooks";
import { useInstitutes } from "../hooks/login";
import { isEmpty } from "../utils";

export function SearchScreen() {
   const tw = useTailwind();
   const { THEME_MAIN } = useTheme();

   const { search, onChange, loading, teachers, searchInstitutes, onInstitutesChange } = useSearch();

   const { institutes } = useInstitutes();

   if (loading) {
      return <Loader text="Загрузка преподавателей" theme={THEME_MAIN} />;
   }

   return (
      <ScreenTemplate style={tw("pt-10")}>
         <View style={tw("px-4 flex flex-col flex-1")}>
            <Input
               value={search}
               onChangeText={onChange}
               label="Имя преподавателя"
               placeholder="Иван Иванов..."
               rightIcon={
                  <TouchableOpacity onPress={() => onChange("")}>
                     <Icon name="close" type="material" color="gray" size={25} />
                  </TouchableOpacity>
               }
            />

            <View style={tw("flex flex-row flex-wrap justify-between mb-8")}>
               {institutes?.map((institute) => (
                  <TouchableOpacity onPress={() => onInstitutesChange(institute.id)} key={institute.id}>
                     <Label
                        type={searchInstitutes.has(institute.id) ? "user_theme" : "secondary"}
                        content={institute.shortName}
                     />
                  </TouchableOpacity>
               ))}
            </View>

            {!isEmpty(teachers) ? (
               <FlatList
                  data={teachers}
                  scrollEnabled
                  renderItem={({ item, index }) => <SearchCard teacher={item} key={index} />}
               />
            ) : (
               <View style={tw("flex flex-col flex-1 justify-center items-center")}>
                  <View>
                     <Text style={tw("text-center mb-2 text-xl font-semibold")}>
                        Нет результатов под заданные фильтры
                     </Text>
                     <Icon name="sentiment-very-dissatisfied" type="material" color={THEME_MAIN} size={30} />
                  </View>
               </View>
            )}
         </View>
      </ScreenTemplate>
   );
}
