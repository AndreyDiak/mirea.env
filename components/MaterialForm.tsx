import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import * as DocumentPicker from "expo-document-picker";
import { Card, Icon, Input } from "@rneui/themed";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useSelector } from "react-redux";
import { getUser } from "../features/userSlice";

type Props = {
  disciplineId: string;
  setIsFormVisible: (isVisible: boolean) => void;
};

const MaterialForm = ({ disciplineId, setIsFormVisible }: Props) => {
  const tw = useTailwind();

  const [isLoading, setIsLoading] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formText, setFormText] = useState("");
  const [documents, setDocuments] = useState<NewDocument[]>([]);
  const [error, setError] = useState("");

  const user = useSelector(getUser);

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
    if (!formText || !formTitle) {
      setError("Заполните все поля!");
      return;
    }

    setIsLoading(true);
    await addDoc(collection(db, "materials"), {
      title: formTitle,
      text: formText,
      owner: user?.userId,
      likes: 0,
      disciplineId: disciplineId,
      timestamp: serverTimestamp(),
    }).then(async (snap) => {
      if (documents.length) {
        documents.map(async (document, index) => {
          await addDoc(collection(db, `materials/${snap.id}/sources`), {
            title: document.name,
          }).then(async (newDoc) => {
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
              `materials/${disciplineId}/${document.name}`
            );

            // @ts-ignore
            await uploadBytes(docRef, blob).then(async (snapshot) => {
              const downloadUrl = await getDownloadURL(docRef);

              await updateDoc(
                doc(db, `materials/${snap.id}/sources/${newDoc.id}`),
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
        {error && (
          <Text style={tw("text-red-400 text-center mb-4")}>{error}</Text>
        )}
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
              <Icon name="close" type="material" color="#374151" size={20} />
            </Text>
          </View>
        ))}

        <Card.Divider />

        <TouchableOpacity onPress={addDocument}>
          <Text style={tw(`text-${user?.theme}-400 text-center mb-4`)}>
            Добавить файлы
          </Text>
        </TouchableOpacity>

        <Card.Divider />

        <TouchableOpacity
          style={tw("flex flex-row justify-center")}
          onPress={submitForm}
        >
          <Text
            style={tw(
              `${
                !isLoading ? `bg-${user?.theme}-400` : "bg-gray-400"
              } text-white font-semibold px-4 py-2 rounded-md`
            )}
          >
            {!isLoading ? "Загрузить" : "Загрузка..."}
          </Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

export default MaterialForm;
