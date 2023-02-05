import React, { useState } from "react";

import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { CheckBox, Icon } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

import { Group, Teacher } from "../../typings";

type Props = {
   title: string;
   attr: "userId" | "groupId";
   list: (Group | Teacher)[];
   selectedList: (Group | Teacher)[];
   setList: (list: any[]) => void;
};

export function CheckListMulitple({ attr, title, list, selectedList, setList }: Props) {
   const tw = useTailwind();

   const [isListVisible, setIsListVisible] = useState(false);

   const toggleList = (newItem: Group | Teacher) => {
      const listCopy = [...selectedList];
      // @ts-ignore we know about needed attr...
      const index = selectedList.findIndex((item) => item[attr] === newItem[attr]);
      if (index !== -1) {
         listCopy.splice(index, 1);
      } else {
         listCopy.push(newItem);
      }
      console.log(listCopy.length);
      setList(listCopy);
   };

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
                        // @ts-ignore addind teacher female if it consist
                        title={`${item.name} ${item.female ? item.female : ""}`}
                        checked={selectedList.some(
                           // @ts-ignore we know about needed attr...
                           (selected) => selected[attr] === item[attr],
                        )}
                        onPress={() => toggleList(item)}
                        containerStyle={tw("")}
                     />
                  </View>
               )}
            />
         )}
      </View>
   );
}
