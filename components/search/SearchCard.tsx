import React from "react";

import { Text, TouchableOpacity } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { useTheme } from "../../hooks";
import { Teacher } from "../../typings";
import { MODAL_TYPES, useGlobalModalContext } from "../common";
import { SearchModal } from "./SearchModal";

interface Props {
   teacher: Teacher;
}

export const SearchCard: React.FC<Props> = React.memo(({ teacher }) => {
   const tw = useTailwind();

   const { APP_THEME_SECONDARY, APP_THEME_TEXT } = useTheme();

   const { openModal } = useGlobalModalContext();

   const openSearchModal = () => {
      openModal(MODAL_TYPES.SIMPLE_MODAL, {
         title: `${teacher.name} ${teacher.female}`,
         // eslint-disable-next-line react/no-unstable-nested-components
         children: () => <SearchModal teacher={teacher} />,
      });
   };

   return (
      <TouchableOpacity
         onPress={openSearchModal}
         style={[
            tw("py-4 px-2 rounded-sm"),
            {
               backgroundColor: APP_THEME_SECONDARY,
            },
         ]}
      >
         <Text
            style={[
               tw("text-lg font-semibold"),
               {
                  color: APP_THEME_TEXT,
               },
            ]}
         >
            {teacher.name} {teacher.female}
         </Text>
      </TouchableOpacity>
   );
});
