import React from "react";

import { Text, TouchableOpacity } from "react-native";

import { Card } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { deleteMaterial } from "../../../api";
import { selectUserAppTheme } from "../../../features/userSlice";
import { useFavorite, useTheme } from "../../../hooks";
import { APP_THEME, Material } from "../../../typings";
import { MaterialFiles } from "./MaterialFiles";
import { MaterialMenu } from "./MaterialMenu";

type Props = {
   material: Material;
   userId: string | undefined;
   userType: string | undefined;
};

export const MaterialCard: React.FC<Props> = React.memo(({ material, userId }) => {
   const tw = useTailwind();
   const userAppTheme = useSelector(selectUserAppTheme);

   const { APP_THEME_SECONDARY, APP_THEME_BORDER, APP_THEME_TEXT } = useTheme();
   const isFavorite = useFavorite(userId, material.id);

   return (
      <Card
         key={material.id}
         containerStyle={{
            backgroundColor: APP_THEME_SECONDARY,
            borderColor: APP_THEME_BORDER,
            borderWidth: userAppTheme === APP_THEME.LIGHT ? 1 : 0,
            borderRadius: 5,
         }}
      >
         <Card.Title
            style={[
               tw("font-bold text-lg"),
               {
                  color: APP_THEME_TEXT,
               },
            ]}
         >
            {material.title}
         </Card.Title>
         <Card.Divider />
         <Text
            style={[
               tw("mb-4"),
               {
                  color: APP_THEME_TEXT,
               },
            ]}
         >
            {material.text}
         </Text>

         <MaterialFiles materialId={material.id} />

         <Card.Divider />
         {/* Icons / Favorites / Comments / Share */}
         <MaterialMenu userId={userId} material={material} isFavorite={isFavorite} />
         {material.ownerId === userId && (
            <TouchableOpacity onPress={() => deleteMaterial(material.id)}>
               <Text style={tw("text-red-400 underline text-center")}>Удалить</Text>
            </TouchableOpacity>
         )}
      </Card>
   );
});
