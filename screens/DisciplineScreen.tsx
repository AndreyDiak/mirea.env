import { View, Text, Linking } from "react-native";
import React, { useLayoutEffect, useRef, useState, useMemo } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTailwind } from "tailwind-rn/dist";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { useSelector } from "react-redux";
import { getUser } from "../features/userSlice";
import { Card, Icon, Input } from "@rneui/themed";
import * as DocumentPicker from "expo-document-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
type Props = {};

type DisciplineScreenRouteProp = RouteProp<RootStackParamList, "Discipline">;

const DisciplineScreen = (props: Props) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [documents, setDocuments] = useState<NewDocument[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formText, setFormText] = useState("");

  console.log('rerender');

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

  // const disciplineQuery = query(
  //   collection(db, `disciplines/${discipline.id}/materials`)
  // );
  // const unsubscribe = onSnapshot(disciplineQuery, (snapshot) => {
  //   let materials: any = [];
  //   materials = snapshot.docs.map((doc) => ({
  //     ...doc.data(),
  //     materialId: doc.id,
  //   }));
  //   setMaterials(materials);
  // });

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
    console.log("upload started");
    await addDoc(collection(db, `disciplines/${discipline.id}/materials`), {
      title: formTitle,
      text: formText,
    }).then(async (snap) => {
      console.log("skeleton created");
      if (documents.length) {
        console.log("lets go upload documents!");
        documents.map(async (document) => {
          await updateDoc(
            doc(db, `disciplines/${discipline.id}/materials/${snap.id}`),
            {
              source: {
                title: document.name,
              },
            }
          );
          console.log("created doc title!");
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
              doc(db, `disciplines/${discipline.id}/materials/${snap.id}`),
              {
                source: {
                  doc: [downloadUrl],
                },
              }
            ).then(() => console.log("docs updated!"));
          });
        });
      }
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
              value={formText}
              onChangeText={setFormText}
            />
            <Input
              label="Описание"
              placeholder="Введите описание..."
              inputStyle={tw("text-sm p-0 m-0")}
              value={formTitle}
              onChangeText={setFormTitle}
            />
            <Card.Divider />
            <Card.Title>Список материалов...</Card.Title>
            {documents.map((document, index) => (
              <View
                key={document.uri}
                style={tw("flex flex-row justify-between items-center")}
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
                  "bg-blue-400 text-white font-semibold px-4 py-2 rounded-md "
                )}
              >
                Загрузить
              </Text>
            </View>
          </Card>
        </View>
      )}
      {materials.length ? (
        materials.map((material) => (
          <Card>
            <Card.Title>{material.title}</Card.Title>
            <Card.Divider />
            <Text>{material.text}</Text>
            {/* <Text onPress={async () => await Linking.openURL(material.source)}>
              Документ
            </Text> */}
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
