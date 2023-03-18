import React, { useState } from "react";

import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { CheckBox, Icon } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

import type { Discipline, Group, Institute, Teacher } from "../../../typings";
import { COLORS_400 } from "../../../utils";

// варианты того, что мы можем выбирать
type Item = Teacher | Discipline | Group | Institute;

interface Props<T> {
   title: string;
   list: T[];
   selectedList: T[];
   setList: (list: T[]) => void;
}

export const CheckListMulitple: React.FC<Props<Item>> = React.memo(
   ({ title, list, selectedList, setList }) => {
      const tw = useTailwind();

      const [isListVisible, setIsListVisible] = useState(false);

      const toggleList = (newItem: Item, isSelected: boolean) => {
         let listCopy = [...selectedList];

         if (isSelected) {
            listCopy = listCopy.filter((item) => item.id !== newItem.id);
         } else {
            listCopy.push(newItem);
         }

         setList(listCopy);
      };

      return (
         <View style={tw("mb-4")}>
            <View style={tw("flex flex-row w-full items-center justify-between")}>
               <Text style={tw("text-center font-semibold")}>{title}</Text>
               <TouchableOpacity onPress={() => setIsListVisible(!isListVisible)}>
                  <Icon
                     name={!isListVisible ? "expand-more" : "expand-less"}
                     color={COLORS_400.BLUE}
                     containerStyle={tw("bg-gray-50 rounded-full p-1")}
                  />
               </TouchableOpacity>
            </View>

            {isListVisible && (
               <FlatList
                  data={list.sort((prev, next) => prev.name.localeCompare(next.name))}
                  scrollEnabled
                  style={tw("max-h-[200px]")}
                  renderItem={({ item, index }) => {
                     const isChecked = selectedList.some((selected) => selected.id === item.id);

                     return (
                        <View>
                           <CheckBox
                              key={index}
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              title={`${item.name} ${item?.female ? item?.female : ""}`}
                              checked={isChecked}
                              onPress={() => toggleList(item, isChecked)}
                           />
                        </View>
                     );
                  }}
               />
            )}
         </View>
      );
   },
);
