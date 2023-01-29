import { Card } from "@rneui/themed";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { deleteMaterial } from "../../../api/materials";
import { db } from "../../../firebase";
import { useFavorite } from "../../../hooks/favorites/useFavorite";
import { MaterialFiles } from "./MaterialFiles";
import { MaterialMenu } from "./MaterialMenu";

type Props = {
  material: Material;
  userId: string | undefined;
  userType: string | undefined;
  userTheme: AppTheme;
};

export const Material: React.FC<Props> = ({ material, userId, userType, userTheme }) => {
  const tw = useTailwind();

  // const [isFavorite, setIsFavorite] = useState<boolean>();

  // const q = query(
  //   collection(db, `users/${userId}/favorites`),
  //   where("materialId", "==", material.id)
  // );

  // // подписка на
  // onSnapshot(q, (snapshot) => {
  //   const isFavorite = snapshot.docs.length > 0;
  //   setIsFavorite(isFavorite);
  // });

  const isFavorite = useFavorite(userId, material.id);

  return (
    <Card key={material.id}>
      <Card.Title style={tw("font-bold text-lg")}>{material.title}</Card.Title>
      <Card.Divider />
      <Text style={tw("mb-4")}>{material.text}</Text>

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
};
