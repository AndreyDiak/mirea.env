import React, { useLayoutEffect, useState } from "react";

import { FlatList, Keyboard, Text, TouchableOpacity, View } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { Card } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { addMessage } from "../api";
import { Loader, ScreenTemplate } from "../components";
import { CustomInputField } from "../components/common/form/CustomInputField";
import { selectUser } from "../features/userSlice";
import { useChats, useTheme } from "../hooks";
import { ChatsScreenNavigationProp, ChatsScreenRouteProp, USER_TYPE } from "../typings";

export function ChatsScreen() {
   const {
      params: { discipline },
   } = useRoute<ChatsScreenRouteProp>();

   const tw = useTailwind();

   const navigation = useNavigation<ChatsScreenNavigationProp>();

   const user = useSelector(selectUser);

   const { APP_THEME_TEXT, APP_THEME_BORDER, APP_THEME_SECONDARY, THEME_MAIN } = useTheme();

   const [message, setMessage] = useState<string>("");
   const [loading, setLoading] = useState<boolean>(false);
   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: discipline.name,
      });
   }, [discipline.name, navigation]);

   const { chats, loading: Dloading } = useChats(discipline.id);

   const sendMessageToAllGroups = async () => {
      setLoading(true);
      Promise.allSettled(
         chats.map(async (chat) => {
            await addMessage(chat.id, {
               text: message.trimEnd(),
               displayName: user.name,
               email: user.email,
               type: user.type,
               photoUrl: user.img,
            });
         }),
      ).then(() => {
         Keyboard.dismiss();
         setMessage("");
      });
      setLoading(false);
   };

   if (Dloading) {
      return <Loader text="Загрузка чатов" theme={user.theme} />;
   }

   return (
      <ScreenTemplate>
         <>
            <View>
               <Text
                  style={[
                     tw("text-center text-lg pt-2"),
                     {
                        color: APP_THEME_TEXT,
                     },
                  ]}
               >
                  Доступные чаты
               </Text>
            </View>
            {/* список всех доступных чатов подключенных к данной дисциплине */}
            <FlatList
               data={chats}
               renderItem={({ item: chat }) => (
                  <Card
                     key={chat.id}
                     containerStyle={{
                        backgroundColor: APP_THEME_SECONDARY,
                        borderColor: APP_THEME_BORDER,
                     }}
                  >
                     <View style={tw("flex flex-row justify-between")}>
                        <Text
                           style={{
                              color: APP_THEME_TEXT,
                           }}
                        >
                           Группа: <Text style={tw("font-bold")}>{chat.groupName}</Text>
                        </Text>
                        <TouchableOpacity
                           onPress={() =>
                              // TODO @raymix разобраться как делать типы
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              navigation.navigate("Chat", {
                                 chatId: chat.id,
                                 groupName: chat.groupName,
                              })
                           }
                        >
                           <Text style={[tw("underline"), { color: THEME_MAIN }]}>Перейти</Text>
                        </TouchableOpacity>
                     </View>
                  </Card>
               )}
            />
            {user.type === USER_TYPE.TEACHER ? (
               <View style={tw("bg-red-100")}>
                  <CustomInputField
                     placeholder="Написать всем группам..."
                     value={message}
                     loading={loading}
                     setValue={setMessage}
                     onSubmit={sendMessageToAllGroups}
                  />
               </View>
            ) : null}
         </>
      </ScreenTemplate>
   );
}
