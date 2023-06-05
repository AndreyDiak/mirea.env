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
   const { THEME } = useTheme();

   const { search, onChange, loading, teachers, searchInstitutes, onInstitutesChange } = useSearch();

   const { institutes, loading: ILoading } = useInstitutes();

   if (loading) {
      return <Loader text="Загрузка преподавателей" theme={THEME} />;
   }

   return (
      <ScreenTemplate style={tw("pt-10")}>
         <View style={tw("px-4")}>
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

            {/*  */}

            <View style={tw("flex flex-row flex-wrap justify-between mb-8")}>
               {institutes?.map((institute) => (
                  <TouchableOpacity onPress={() => onInstitutesChange(institute.id)}>
                     <Label
                        key={institute.id}
                        type={searchInstitutes.has(institute.shortName) ? "user_theme" : "secondary"}
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
            ) : null}
         </View>
      </ScreenTemplate>
   );
}
