import { useNavigation } from "@react-navigation/native";
import { Card, Icon } from "@rneui/themed";
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { db } from "../firebase";
import { ToastAndroid } from 'react-native'
type Props = {
  material: Material;
  userId: string | undefined;
};

const Material = ({ material, userId }: Props) => {
  const tw = useTailwind();

  // const toast = useToast()

  const navigation = useNavigation<DisciplineScreenNavigatorProp>();

  const deleteMaterial = async () => {
    await deleteDoc(doc(db, `materials/${material.materialId}`));
  };

  const like = async () => {
    ToastAndroid.show('Добавлено в избранные')
    // toast.show('Hello')
    console.log('hello')
    // await updateDoc(doc(db, `materials/${material.materialId}`), {
    //   likes: material.likes + 1,
    // });
  };

  return (
    <Card key={material.materialId}>
      <Card.Title style={tw("font-bold text-lg")}>{material.title}</Card.Title>
      <Card.Divider />
      <Text style={tw("mb-4")}>{material.text}</Text>

      {!!material.documents.length && (
        <View style={tw("mb-2")}>
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
        </View>
      )}
      <Card.Divider />
      {/* Icons / Favorites / Comments / Share */}
      <View style={tw("flex flex-row justify-end items-center mb-2")}>
        {/* Add to Favorites... */}
        <TouchableOpacity style={tw("mr-2")} onPress={like}>
          <Icon
            name="favorite-border"
            type="material"
            size={25}
            color={"gray"}
          />
        </TouchableOpacity>
        {/* Open comments... */}
        <TouchableOpacity
        style={tw('mr-2')}
          onPress={() => navigation.navigate("Comments", { material })}
        >
          <Icon name="comment" type="material" size={25} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="reply" type="material" size={25} color="gray" />
        </TouchableOpacity>
      </View>
      {material.owner === userId && (
        <>
          <Text
            onPress={deleteMaterial}
            style={tw("text-red-400 underline text-center")}
          >
            Удалить
          </Text>
        </>
      )}
    </Card>
  );
};

export default Material;
