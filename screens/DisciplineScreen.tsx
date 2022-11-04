import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where
} from "firebase/firestore";
import React, { useLayoutEffect, useState } from "react";
import {
  FlatList, Text, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import Material from "../components/Material";
import MaterialForm from "../components/MaterialForm";
import { getUser } from "../features/userSlice";
import { db } from "../firebase";
import { returnHexCode } from "../utils/returnHexCode";
type Props = {};

type DisciplineScreenRouteProp = RouteProp<RootStackParamList, "Discipline">;

const DisciplineScreen = (props: Props) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const tw = useTailwind();
  const navigation = useNavigation<DisciplineScreenNavigatorProp>();
  const user = useSelector(getUser);

  const {
    params: { discipline },
  } = useRoute<DisciplineScreenRouteProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: discipline.title,
    });
  }, [discipline]);

  const materialsQuery = query(
    collection(db, "materials"),
    where("disciplineId", "==", discipline.id),
    orderBy("timestamp")
  );

  const unsubscribe = onSnapshot(materialsQuery, async (snapshot) => {
    const snapMaterials = await Promise.all(
      snapshot.docs.map(async (material) => {
        // добавляем documents в материал...
        const docQ = query(collection(db, `materials/${material.id}/sources`));
        const docSnap = await getDocs(docQ);
        // добавляем comments к материалу...
        const commentsQuery = query(
          collection(db, "comments"),
          where("materialId", "==", material.id),
          orderBy("timestamp")
        );
        const commentSnap = await getDocs(commentsQuery);
        return {
          ...material.data(),
          documents: docSnap.docs.map((doc) => ({
            ...doc.data(),
            documentId: doc.id,
          })),
          comments: commentSnap.docs.map((comment) => ({
            ...comment.data(),
            commentId: comment.id,
          })),
          materialId: material.id,
        };
      })
    );

    if (materials.length !== snapMaterials.length) {
      setMaterials(snapMaterials as Material[]);
    }
  });

  return (
    <SafeAreaView style={tw("flex flex-col px-4")}>
      {user?.type === "teacher" && (
        <View style={tw('')}>
          <TouchableOpacity
            style={tw("flex flex-row justify-end")}
            onPress={() => setIsFormVisible(!isFormVisible)}
          >
            <View style={tw("flex flex-row items-center")}>
              <Text style={tw("text-blue-400")}>
                {isFormVisible ? "Закрыть" : "Добавить материалы"}
              </Text>
              <Icon
                name={!isFormVisible ? "expand-more" : "expand-less"}
                type="material"
                color="#60a5fa"
                size={25}
              />
            </View>
          </TouchableOpacity>
          {isFormVisible && (
            <MaterialForm
              disciplineId={discipline.id}
              setIsFormVisible={setIsFormVisible}
            />
          )}
        </View>
      )}
      <View>
        {materials.length ? (
          <FlatList
            style={tw("")}
            data={materials.reverse()}
            scrollEnabled
            showsVerticalScrollIndicator={false}
            renderItem={(item) => {
              return <Material material={item.item} userId={user?.userId} userType={user?.type} />;
            }}
          />
        ) : (
          <View style={tw("w-full h-full flex items-center justify-center")}>
            <View>
              <Text style={tw("mb-2 text-lg")}>Тут пока нет материалов...</Text>
              <Icon
                name="inventory"
                type="material"
                color={returnHexCode(user?.theme as AppTheme)}
                size={30}
              />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DisciplineScreen;
