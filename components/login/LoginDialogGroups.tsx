import React from "react";

import { FlatList, View } from "react-native";

import { CheckBox } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUserGroup, selectUserInstitutes, setGroup } from "../../features/slices/authSlice";
import { useFilteredGroups } from "../../hooks/login";
import { COLORS_400, Group } from "../../typings";
import { LFilter } from "../../typings/enums";
import { isEmpty } from "../../utils";
import { FullScreenError, FullScreenLoader } from "../common";

interface Props {
   filter: LFilter;
}

export const LoginDialogGroups: React.FC<Props> = React.memo(({ filter }) => {
   const tw = useTailwind();
   const dispatch = useDispatch();

   const myInstitutes = useSelector(selectUserInstitutes);
   const myGroup = useSelector(selectUserGroup);
   const { groups, loading: GLoading } = useFilteredGroups(myInstitutes, filter);

   const toggleMyGroup = (group: Group) => {
      dispatch(setGroup({ group }));
   };

   const renderData = () => {
      if (GLoading) {
         return <FullScreenLoader text="Загрузка доступных групп" theme={COLORS_400.BLUE} />;
      }
      if (isEmpty(groups)) {
         return <FullScreenError text="Группы не найдены" theme={COLORS_400.BLUE} />;
      }

      return (
         <FlatList
            data={groups.sort((prev, next) => prev.name.localeCompare(next.name))}
            scrollEnabled
            showsVerticalScrollIndicator={false}
            renderItem={({ item: group, index }) => (
               <CheckBox
                  key={index}
                  title={group.name}
                  checked={group.id === myGroup?.id}
                  onPress={() => toggleMyGroup(group)}
                  containerStyle={tw("text-center")}
               />
            )}
         />
      );
   };

   return <View style={tw("max-h-[350px] flex")}>{renderData()}</View>;
});
