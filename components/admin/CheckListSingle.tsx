import React, { useState } from "react";

import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { CheckBox, Icon } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

type Props = {
   title: string;
   attr: "userId" | "disciplineId" | "instituteId" | "groupId";
   list: (Group | Discipline | Institute | Group)[];
   selectedItem: Group | Teacher | Institute | Discipline | null;
   setSelectedItem: (item: any) => void;
};

export function CheckListSingle({ attr, title, list, selectedItem, setSelectedItem }: Props) {
   const tw = useTailwind();
   const [isListVisible, setIsListVisible] = useState(false);

   return (
      <View style={tw("mb-4")}>
         <View style={tw("flex flex-row w-full items-center justify-between")}>
            <Text style={tw("text-center font-semibold")}>{title}</Text>
            <TouchableOpacity onPress={() => setIsListVisible(!isListVisible)}>
               <Icon
                  name={!isListVisible ? "expand-more" : "expand-less"}
                  color="#60a5fa"
                  containerStyle={tw("bg-gray-50 rounded-full p-1")}
               />
            </TouchableOpacity>
         </View>

         {isListVisible && (
            <FlatList
               data={list.sort((prev, next) => prev.name.localeCompare(next.name))}
               scrollEnabled
               style={tw("max-h-[200px]")}
               renderItem={({ item, index }) => (
                  <View>
                     <CheckBox
                        key={index}
                        title={item.name}
                        // @ts-ignore right attr...
                        checked={!!selectedItem && item[attr] === selectedItem[attr]}
                        onPress={() => setSelectedItem(item)}
                        containerStyle={tw("")}
                     />
                  </View>
               )}
            />
         )}
      </View>
   );
}
