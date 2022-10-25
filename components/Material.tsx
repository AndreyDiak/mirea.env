import { View, Text, Linking } from "react-native";
import React from "react";
import { Card } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

type Props = {
  material: Material;
  userId: string | undefined;
};

const Material = ({ material, userId }: Props) => {
  const tw = useTailwind();
  
  const deleteMaterial = async () => {
    await deleteDoc(doc(db, `materials/${material.materialId}`));
  }

  return (
    <Card key={material.materialId}>
      <Card.Title style={tw("font-bold text-lg")}>{material.title}</Card.Title>
      <Card.Divider />
      <Text style={tw("mb-4")}>{material.text}</Text>

      {!!material.documents.length && (
        <>
          <Card.Divider />
          <Text style={tw("mb-4 text-center")}>Прикрепленные файлы</Text>
          {material.documents.map((document) => (
            <View key={document.documentId}>
              <Text
                style={tw("mb-2 font-semibold underline text-blue-400")}
                onPress={async () => await Linking.openURL(document.document)}
              >
                {document.title}
              </Text>
            </View>
          ))}
        </>
      )}
      {material.owner === userId && (
        <>
          <Card.Divider />
          <Text onPress={deleteMaterial} style={tw('text-red-400 underline text-right')}>Удалить материалы</Text>
        </>
      )}
    </Card>
  );
};

export default Material;
