import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Card, Icon, Input } from "@rneui/themed";
import * as DocumentPicker from "expo-document-picker";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Linking, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import { getUser } from "../features/userSlice";
import { db, storage } from "../firebase";
type Props = {};

type DisciplineScreenRouteProp = RouteProp<RootStackParamList, "Discipline">;

const DisciplineScreen = (props: Props) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [documents, setDocuments] = useState<NewDocument[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formText, setFormText] = useState("");

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
        collection(db, `disciplines/${discipline.id}/materials`)
      );
      const materialsSnap = await getDocs(materialsQuery);

      const materials = await Promise.all(
        materialsSnap.docs.map(async (material) => {
          const docQ = query(
            collection(
              db,
              `disciplines/${discipline.id}/materials/${material.id}/sources`
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
      console.log(materials);
      setMaterials(materials as Material[]);
    };
    getMaterials();
  }, []);

  // const unsubscribe = onSnapshot(materialsQuery, async (snapshot) => {
  //   let materialsCopy: any = [];
  //   snapshot.forEach((doc) => {
  //     materialsCopy.push({
  //       ...doc.data(),
  //       materialId: doc.id,
  //     });
  //   });
  //   console.log(materialsCopy);
  //   if (materials.length !== materialsCopy.length) {
  //     setMaterials(materialsCopy);
  //   }
  // });

  // const documentsQuery = query(collection);

  const addDocument = async () => {
    await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: false,
    }).then(async (docs) => {
      if (docs.type === "success") {
        const document: NewDocument = {
          name: docs.name,
          uri: docs.uri,
          type: docs.mimeType,
        };
        let documentsCopy = [...documents];
        documentsCopy.push(document);
        setDocuments(documentsCopy);
      }
    });
  };

  const submitForm = async () => {
    setIsLoading(true);
    await addDoc(collection(db, `disciplines/${discipline.id}/materials`), {
      title: formTitle,
      text: formText,
    }).then(async (snap) => {
      if (documents.length) {
        documents.map(async (document, index) => {
          await addDoc(
            collection(
              db,
              `disciplines/${discipline.id}/materials/${snap.id}/sources`
            ),
            {
              title: document.name,
            }
          ).then(async (newDoc) => {
            const blob = await new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.onload = () => {
                resolve(xhr.response);
              };
              xhr.onerror = (e) => {
                reject(new TypeError("Network request failed"));
              };
              xhr.responseType = "blob";
              xhr.open("GET", document.uri, true);
              xhr.send(null);
            });

            const docRef = ref(
              storage,
              `materials/${discipline.id}/${document.name}`
            );

            // @ts-ignore
            await uploadBytes(docRef, blob).then(async (snapshot) => {
              const downloadUrl = await getDownloadURL(docRef);

              await updateDoc(
                doc(
                  db,
                  `disciplines/${discipline.id}/materials/${snap.id}/sources/${newDoc.id}`
                ),
                {
                  document: downloadUrl,
                }
              ).then(() => console.log("docs added!"));
            });
          });
        });
      }
      setIsLoading(false);
      setDocuments([]);
      setIsFormVisible(false);
      setFormText("");
      setFormTitle("");
    });
  };

  return (
    <View style={tw("p-6")}>
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
        <View>
          <Card>
            <Input
              label="Тема"
              placeholder="Введите название темы..."
              inputStyle={tw("text-sm")}
              value={formTitle}
              onChangeText={setFormTitle}
            />
            <Input
              label="Описание"
              placeholder="Введите описание..."
              inputStyle={tw("text-sm p-0 m-0")}
              value={formText}
              onChangeText={setFormText}
            />
            {documents.length > 0 && (
              <>
                <Card.Divider />
                <Card.Title>Список материалов...</Card.Title>
              </>
            )}
            {documents.map((document, index) => (
              <View
                key={document.uri}
                style={tw("flex flex-row justify-between items-center mb-2")}
              >
                <Text style={tw("text-xs mb-2 w-5/6")}>{document.name}</Text>
                <Text
                  onPress={() =>
                    setDocuments(
                      documents.length > 1 ? documents.splice(index, 1) : []
                    )
                  }
                >
                  <Icon
                    name="close"
                    type="material"
                    color="#374151"
                    size={20}
                  />
                </Text>
              </View>
            ))}
            <Card.Divider />
            <Text
              style={tw("text-blue-400 text-center mb-4")}
              onPress={addDocument}
            >
              Добавить файлы
            </Text>
            <Card.Divider />
            <View style={tw("flex flex-row justify-center")}>
              <Text
                onPress={submitForm}
                style={tw(
                  `${
                    !isLoading ? "bg-blue-400" : "bg-gray-400"
                  } text-white font-semibold px-4 py-2 rounded-md`
                )}
              >
                {!isLoading ? "Загрузить" : "Загрузка..."}
              </Text>
            </View>
          </Card>
        </View>
      )}
      {materials.length ? (
        materials.map((material) => (
          <Card key={material.materialId}>
            <Card.Title style={tw("font-bold text-lg")}>
              {material.title}
            </Card.Title>
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
                      onPress={async () =>
                        await Linking.openURL(document.document)
                      }
                    >
                      {document.title}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </Card>
        ))
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
