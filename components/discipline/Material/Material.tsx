import { Card } from "@rneui/themed";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { deleteMaterial } from "../../../api/materials";
import { useFavorite } from "../../../hooks/favorites/useFavorite";
import { AppTheme, Material } from "../../../typings";
import { MaterialFiles } from "./MaterialFiles";
import { MaterialMenu } from "./MaterialMenu";

type Props = {
  material: Material;
  userId: string | undefined;
  userType: string | undefined;
  userTheme: AppTheme;
};

export const Material: React.FC<Props> = React.memo(({ material, userId, userType, userTheme }) => {
  const tw = useTailwind();

  const isFavorite = useFavorite(userId, material.id);

  return (
    <Card key={material.id}>
      <Card.Title style={tw("font-bold text-lg")}>{material.title}</Card.Title>
      <Card.Divider />
      <Text style={tw("mb-4")}>{material.text}</Text>
      {/* TODO переделать на отдельную загрузку */}
      <MaterialFiles documents={material?.documents || []} userTheme={userTheme || "blue"} />

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
