import { Card, Icon, Input } from "@rneui/themed";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import { addMaterial } from "../../../api";
import { selectUser } from "../../../features/userSlice";
import { NewDocument } from "../../../typings";
import { returnHexCode } from "../../../utils/";

type Props = {
  disciplineId: string;
  setIsFormVisible: (isVisible: boolean) => void;
};

export const MaterialForm = ({ disciplineId, setIsFormVisible }: Props) => {
  const tw = useTailwind();

  const [isLoading, setIsLoading] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formText, setFormText] = useState("");
  const [documents, setDocuments] = useState<NewDocument[]>([]);
  const [error, setError] = useState("");

  const user = useSelector(selectUser);

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
    await addMaterial(formTitle, formText, user.userId, disciplineId, documents);

    setIsLoading(false);
    setDocuments([]);
    setIsFormVisible(false);
    setFormText("");
    setFormTitle("");
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
        {error && <Text style={tw("text-red-400 text-center mb-4")}>{error}</Text>}
        {/* documents list */}
        {documents.length > 0 && (
          <>
            <Card.Divider />
            <Card.Title>Список материалов...</Card.Title>

            {documents.map((document, index) => (
              <View
                key={document.uri}
                style={tw("flex flex-row justify-between items-center mb-2")}
              >
                <Text style={tw("text-xs mb-2 w-5/6")}>{document.name}</Text>
                <TouchableOpacity
                  onPress={() =>
                    setDocuments(documents.length > 1 ? documents.splice(index, 1) : [])
                  }
                >
                  <Icon name="close" type="material" color="#374151" size={20} />
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <Card.Divider />
        {/* add documents handler */}
        <TouchableOpacity onPress={addDocument}>
          <Text style={[tw("text-center mb-4"), { color: returnHexCode(user.theme) }]}>
            Добавить файлы
          </Text>
        </TouchableOpacity>

        <Card.Divider />
        {/* submit form handler */}
        <TouchableOpacity style={tw("flex flex-row justify-center")} onPress={submitForm}>
          <Text
            style={[
              tw("text-white font-semibold px-4 py-2 rounded-md"),
              {
                backgroundColor: !isLoading ? returnHexCode(user.theme) : "#9ca3af",
              },
            ]}
          >
            {!isLoading ? "Загрузить" : "Загрузка..."}
          </Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};
