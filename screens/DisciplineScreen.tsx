import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Card, Icon } from "@rneui/themed";
import {
  collection, getDocs,
  orderBy,
  query, where
} from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Linking, ScrollView, Text, View, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import MaterialForm from "../components/MaterialForm";
import { getUser } from "../features/userSlice";
import { db } from "../firebase";
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

  useEffect(() => {
    const getMaterials = async () => {
      const materialsQuery = query(
        collection(db, 'materials'), where('disciplineId', '==', discipline.id), orderBy('timestamp')
      );
      const materialsSnap = await getDocs(materialsQuery);

      const materials = await Promise.all(
        materialsSnap.docs.map(async (material) => {
          const docQ = query(
            collection(
              db,
              `materials/${material.id}/sources`
            )
          );
          const docSnap = await getDocs(docQ);
          return {
            ...material.data(),
            documents: docSnap.docs.map((doc) => ({
              ...doc.data(),
              documentId: doc.id,
            })),
            materialId: material.id,
          };
        })
      );
      setMaterials(materials as Material[]);
    };
    getMaterials();
  }, []);

  return (
    <View style={tw("p-6 flex flex-col")}>
      {user?.type === "teacher" && (
        <View>
          <Text
            style={tw("text-right")}
            onPress={() => setIsFormVisible(!isFormVisible)}
          >
            <View style={tw("flex flex-row items-center")}>
              <Text style={tw("text-blue-400 text-right")}>
                {isFormVisible ? "Закрыть" : "Добавить материалы"}
              </Text>
              <Icon
                name={!isFormVisible ? "expand-more" : "expand-less"}
                type="material"
                color="#60a5fa"
                size={25}
              />
            </View>
          </Text>
        </View>
      )}
      {isFormVisible && (
        <MaterialForm disciplineId={discipline.id} setIsFormVisible={setIsFormVisible} />
      )}
      {materials.length ? (
        <>
          <FlatList 
            data={materials}
            renderItem={(item) => {
              return (
                <Text></Text>
              )
            }}
          />

        </>
        // <ScrollView style={tw('py-4')}>
        //   {/* {materials.map((material) => (
        //   <Card key={material.materialId}>
        //     <Card.Title style={tw("font-bold text-lg")}>
        //       {material.title}
        //     </Card.Title>
        //     <Card.Divider />
        //     <Text style={tw("mb-4")}>{material.text}</Text>

        //     {!!material.documents.length && (
        //       <>
        //         <Card.Divider />
        //         <Text style={tw("mb-4 text-center")}>Прикрепленные файлы</Text>
        //         {material.documents.map((document) => (
        //           <View key={document.documentId}>
        //             <Text
        //               style={tw("mb-2 font-semibold underline text-blue-400")}
        //               onPress={async () =>
        //                 await Linking.openURL(document.document)
        //               }
        //             >
        //               {document.title}
        //             </Text>
        //           </View>
        //         ))}
        //       </>
        //     )}
        //   </Card>
        // ))} */}
        // </ScrollView>
      ) : (
        <View style={tw("w-full h-full flex items-center justify-center")}>
          <View>
            <Text style={tw("mb-2 text-lg")}>Тут пока нет материалов...</Text>
            <Icon name="inventory" type="material" color="#60a5fa" size={30} />
          </View>
        </View>
      )}
    </View>
  );
};

export default DisciplineScreen;
