import { useNavigation } from "@react-navigation/native";
import { Card, Icon } from "@rneui/themed";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { db } from "../../firebase";
import { ToastAndroid } from "react-native";
import { returnHexCode } from "../../utils/returnHexCodes";

type Props = {
  material: Material;
  userId: string | undefined;
  userType: string | undefined;
  userTheme: string | undefined;
};

const Material = ({ material, userId, userType, userTheme }: Props) => {
  const tw = useTailwind();

  // const toast = useToast()
  const [isFavorite, setIsFavorite] = useState<boolean>();
  const navigation = useNavigation<DisciplineScreenNavigatorProp>();

  const deleteMaterial = async () => {
    await deleteDoc(doc(db, `materials/${material.materialId}`));
  };

  const handleClick = async () => {
    if (!isFavorite) {
      await addDoc(collection(db, `users/${userId}/favorites`), {
        materialId: material.materialId,
      });
      ToastAndroid.show("Добавлено в избранные", 1000);
    } else {
      const favorites = await getDocs(
        query(
          collection(db, `users/${userId}/favorites`),
          where("materialId", "==", material.materialId)
        )
      );
      await deleteDoc(
        doc(db, `users/${userId}/favorites/${favorites.docs[0].id}`)
      );
      ToastAndroid.show("Удалено из избранных", 1000);
    }
  };

  const onReplyClick = async () => {
    if (userType === "teacher") {
      navigation.navigate();
    } else {
      // userType === 'student'
    }
  };

  const q = query(
    collection(db, `users/${userId}/favorites`),
    where("materialId", "==", material.materialId)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const isFavorite = snapshot.docs.length > 0;
    setIsFavorite(isFavorite);
  });

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
            <TouchableOpacity
              key={document.documentId}
              onPress={async () => await Linking.openURL(document.document)}
            >
              <Text
                style={[
                  tw("mb-2 font-semibold underline"),
                  { color: returnHexCode(userTheme as AppTheme) },
                ]}
              >
                {document.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Card.Divider />
      {/* Icons / Favorites / Comments / Share */}
      <View style={tw("flex flex-row justify-end items-center mb-2")}>
        {/* Add / Remove to Favorites... */}
        <TouchableOpacity style={tw("mr-4")} onPress={handleClick}>
          {isFavorite ? (
            <Icon name="favorite" type="material" size={25} color="#f87171" />
          ) : (
            <Icon
              name="favorite-border"
              type="material"
              size={25}
              color="gray"
            />
          )}
        </TouchableOpacity>
        {/* Open comments... */}
        <TouchableOpacity
          style={tw("mr-4")}
          onPress={() => navigation.navigate("Comments", { material })}
        >
          <Icon name="comment" type="material" size={25} color="gray" />
        </TouchableOpacity>
        {/* Reply */}
        <TouchableOpacity onPress={onReplyClick}>
          <Icon name="reply" type="material" size={25} color="gray" />
        </TouchableOpacity>
      </View>
      {material.owner === userId && (
        <TouchableOpacity onPress={deleteMaterial}>
          <Text style={tw("text-red-400 underline text-center")}>Удалить</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
};

export default Material;
