import React from "react";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Card, Icon, Input } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUser } from "../../../features/slices/userSlice";
import { useMaterialForm, useTheme } from "../../../hooks";
import { COLORS_COMMON, isEmpty } from "../../../utils";

type Props = {
   disciplineId: string;
   setIsFormVisible: (isVisible: boolean) => void;
};

export function MaterialForm({ disciplineId, setIsFormVisible }: Props) {
   const tw = useTailwind();

   const { APP_THEME_SECONDARY, APP_THEME_BORDER, APP_THEME_TEXT, THEME_MAIN } = useTheme();

   const user = useSelector(selectUser);

   const {
      text,
      title,
      error,
      setText,
      isLoading,
      documents,
      setTitle,
      addDocument,
      submitForm,
      setDocuments,
   } = useMaterialForm(user.id, disciplineId);

   const submitHandler = () => {
      submitForm();
      setIsFormVisible(false);
   };

   return (
      <View style={tw("")}>
         <Card
            containerStyle={{
               backgroundColor: APP_THEME_SECONDARY,
               borderColor: APP_THEME_BORDER,
            }}
         >
            <Input
               label="Тема"
               placeholder="Введите название темы..."
               inputStyle={[
                  tw("text-sm"),
                  {
                     color: APP_THEME_TEXT,
                  },
               ]}
               value={title}
               onChangeText={setTitle}
            />
            <Input
               label="Описание"
               placeholder="Введите описание..."
               inputStyle={[
                  tw("text-sm p-0 m-0"),
                  {
                     color: APP_THEME_TEXT,
                  },
               ]}
               value={text}
               onChangeText={setText}
            />
            {error && <Text style={tw("text-red-400 text-center mb-4")}>{error}</Text>}
            {/* documents list */}
            {!isEmpty(documents) && (
               <>
                  <Card.Divider />
                  <Card.Title
                     style={{
                        color: APP_THEME_TEXT,
                     }}
                  >
                     Список материалов...
                  </Card.Title>

                  <ScrollView
                     style={{
                        maxHeight: 150,
                     }}
                  >
                     {documents.map((document, index) => (
                        <View
                           key={document.uri}
                           style={tw("flex flex-row justify-between items-center mb-2")}
                        >
                           <Text
                              style={[
                                 tw("text-xs mb-2 w-5/6"),
                                 {
                                    color: APP_THEME_TEXT,
                                 },
                              ]}
                           >
                              {document.name}
                           </Text>
                           <TouchableOpacity
                              onPress={() =>
                                 setDocuments(documents.length > 1 ? documents.splice(index, 1) : [])
                              }
                           >
                              <Icon name="close" type="material" color={APP_THEME_TEXT} size={20} />
                           </TouchableOpacity>
                        </View>
                     ))}
                  </ScrollView>
               </>
            )}

            <Card.Divider />
            {/* add documents handler */}
            <TouchableOpacity onPress={addDocument}>
               <Text style={[tw("text-center mb-4"), { color: THEME_MAIN }]}>Добавить файлы</Text>
            </TouchableOpacity>

            <Card.Divider />
            {/* submit form handler */}
            {/* TODO возможно стоит заменить на Button */}
            <TouchableOpacity style={tw("flex flex-row justify-center")} onPress={submitHandler}>
               <Text
                  style={[
                     tw("text-white font-semibold px-4 py-2 rounded-md"),
                     {
                        backgroundColor: !isLoading ? THEME_MAIN : COLORS_COMMON.DISABLED,
                     },
                  ]}
               >
                  {!isLoading ? "Загрузить" : "Загрузка..."}
               </Text>
            </TouchableOpacity>
         </Card>
      </View>
   );
}
