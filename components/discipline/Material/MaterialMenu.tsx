import React from "react";

import { TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { handleFavorite } from "../../../api";
import { selectUserAppTheme } from "../../../features/slices/userSlice";
import type { DisciplineScreenNavigationProp, Material } from "../../../typings";
import { APP_THEME } from "../../../typings/enums";

interface Props {
   userId: string;
   material: Material;
   isFavorite: boolean;
}

export const MaterialMenu: React.FC<Props> = React.memo(({ userId, material, isFavorite }) => {
   const tw = useTailwind();
   const navigation = useNavigation<DisciplineScreenNavigationProp>();

   const userAppTheme = useSelector(selectUserAppTheme);

   const iconColor = userAppTheme === APP_THEME.LIGHT ? "gray" : "#f8fafc";

   // еще не реализовано
   const onReplyClick = async () => {
      // if (userType === "teacher") {
      //   navigation.navigate();
      // } else {
      //   // userType === 'student'
      // }
   };
   return (
      <View style={tw("flex flex-row justify-end items-center mb-2")}>
         {/* Add / Remove to Favorites... */}
         <TouchableOpacity style={tw("mr-4")} onPress={() => handleFavorite(userId, material.id, isFavorite)}>
            {isFavorite ? (
               <Icon name="favorite" type="material" size={25} color="#f87171" />
            ) : (
               <Icon name="favorite-border" type="material" size={25} color={iconColor} />
            )}
         </TouchableOpacity>
         {/* Open comments... */}
         <TouchableOpacity style={tw("mr-4")} onPress={() => navigation.navigate("Comments", { material })}>
            <Icon name="comment" type="material" size={25} color={iconColor} />
         </TouchableOpacity>
         {/* Reply */}
         <TouchableOpacity onPress={onReplyClick}>
            <Icon name="reply" type="material" size={25} color={iconColor} />
         </TouchableOpacity>
      </View>
   );
});
