import React from "react";

import { FlatList, View } from "react-native";

import { CheckBox } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUserInstitutes, setInstitutes } from "../../features/authSlice";
import { useInstitutes } from "../../hooks/login";
import { Institute, USER_THEME } from "../../typings";
import { Loader } from "../common";

export const LoginDialogInstitutes: React.FC = React.memo(() => {
   const { institutes, loading } = useInstitutes();

   const dispatch = useDispatch();
   const myInstitutes = useSelector(selectUserInstitutes);

   const toggleInstitute = (institute: Institute) => {
      dispatch(setInstitutes({ institute }));
   };

   const tw = useTailwind();

   const renderData = () => {
      if (loading) {
         return <Loader text="Загрузка доступных институтов" theme={USER_THEME.BLUE} />;
      }
      return (
         <FlatList
            data={institutes}
            scrollEnabled
            style={tw("max-h-[350px]")}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: institute, index }) => {
               const isSelected = myInstitutes.some((item) => item.id === institute.id);
               return (
                  <CheckBox
                     key={index}
                     title={institute.name}
                     checked={isSelected}
                     onPress={() => toggleInstitute(institute)}
                     containerStyle={tw("text-center")}
                  />
               );
            }}
         />
      );
   };

   return <View style={tw("max-h-[350px]")}>{renderData()}</View>;
});
