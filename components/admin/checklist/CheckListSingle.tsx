import React, { useState } from "react";

import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { CheckBox, Icon } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

import type { Discipline, Group, Institute } from "../../../typings";
import { COLORS_400 } from "../../../utils";

// варианты того, что мы можем выбирать
type Item = Group | Institute | Discipline;

interface Props<T> {
   title: string;
   list: T[];
   selectedItem: T;
   previewText?: string;
   setSelectedItem: (item: T) => void;
}

export const CheckListSingle: React.FC<Props<Item>> = React.memo(
   ({ title, list, selectedItem, previewText, setSelectedItem }) => {
      const tw = useTailwind();
      const [isListVisible, setIsListVisible] = useState(false);

      const handleClick = (item: Item) => {
         setSelectedItem(item);
         setIsListVisible(false);
      };

      return (
         <View style={tw("mb-4")}>
            <TouchableOpacity onPress={() => setIsListVisible(!isListVisible)}>
               <View style={tw("flex flex-row w-full items-center justify-between")}>
                  <View style={tw("flex flex-row")}>
                     <Text style={tw("text-center font-semibold mr-2")}>{title}</Text>
                     {selectedItem ? <Text style={tw("font-bold")}>({previewText})</Text> : null}
                  </View>

                  <Icon
                     name={!isListVisible ? "expand-more" : "expand-less"}
                     color={COLORS_400.BLUE}
                     containerStyle={tw("bg-gray-50 rounded-full p-1")}
                  />
               </View>
            </TouchableOpacity>

            {isListVisible && (
               <FlatList
                  data={list.sort((prev, next) => prev.name.localeCompare(next.name))}
                  scrollEnabled
                  style={tw("max-h-[250px]")}
                  renderItem={({ item, index }) => (
                     <CheckBox
                        key={index}
                        title={item.name}
                        checked={item.id === selectedItem?.id}
                        onPress={() => handleClick(item)}
                     />
                  )}
               />
            )}
         </View>
      );
   },
);
