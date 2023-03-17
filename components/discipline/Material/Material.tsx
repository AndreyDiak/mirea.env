import React from "react";

import { Text, TouchableOpacity } from "react-native";

import { Card } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { deleteMaterial } from "../../../api";
import { selectUserAppTheme } from "../../../features/userSlice";
import { useFavorite } from "../../../hooks";
import type { AppTheme, Material } from "../../../typings";
import { APP_THEME } from "../../../typings/enums";
import { returnAppThemeSecondary, returnAppThemeText, returnAppThemeForBorder } from "../../../utils";
import { MaterialFiles } from "./MaterialFiles";
import { MaterialMenu } from "./MaterialMenu";

type Props = {
   material: Material;
   userId: string | undefined;
   userType: string | undefined;
   userTheme: AppTheme;
};

export const MaterialCard: React.FC<Props> = React.memo(({ material, userId }) => {
   const tw = useTailwind();
   const userAppTheme = useSelector(selectUserAppTheme);
   const isFavorite = useFavorite(userId, material.id);

   return (
      <Card
         key={material.id}
         containerStyle={{
            backgroundColor: returnAppThemeSecondary(userAppTheme),
            borderColor: returnAppThemeForBorder(userAppTheme),
            borderWidth: userAppTheme === APP_THEME.LIGHT ? 1 : 0,
            borderRadius: 5,
         }}
      >
         <Card.Title
            style={[
               tw("font-bold text-lg"),
               {
                  color: returnAppThemeText(userAppTheme),
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
                  color: returnAppThemeText(userAppTheme),
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
