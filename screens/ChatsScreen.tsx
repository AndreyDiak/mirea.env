import React, { useLayoutEffect, useState } from "react";

import { FlatList, Keyboard, Text, TouchableOpacity, View } from "react-native";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Card } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { addMessage } from "../api";
import { Loader } from "../components";
import { CustomInputField } from "../components/common/form/CustomInputField";
import { selectUser } from "../features/userSlice";
import { useChats } from "../hooks";
import type { ChatsScreenNavigatorProp, RootStackParamList } from "../typings";
import { returnHexCode } from "../utils/returnHexCodes";

type ChatsScreenRouteProp = RouteProp<RootStackParamList, "Chats">;

export function ChatsScreen() {
   const tw = useTailwind();

   const navigation = useNavigation<ChatsScreenNavigatorProp>();

   const user = useSelector(selectUser);

   const [message, setMessage] = useState<string>("");
   const [loading, setLoading] = useState<boolean>(false);

   const {
      params: { discipline },
   } = useRoute<ChatsScreenRouteProp>();

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
      <View style={tw("relative h-full")}>
         <View>
            <Text style={tw("text-center text-lg pt-2")}>Доступные чаты</Text>
         </View>
         {/* список всех доступных чатов подключенных к данной дисциплине */}
         <FlatList
            data={chats}
            renderItem={({ item: chat }) => (
               <Card key={chat.id}>
                  <View style={tw("flex flex-row justify-between")}>
                     <Text>
                        Группа: <Text style={tw("font-bold")}>{chat.groupName}</Text>
                     </Text>
                     <TouchableOpacity
                        onPress={() =>
                           navigation.navigate("Chat", {
                              chatId: chat.id,
                              groupName: chat.groupName,
                           })
                        }
                     >
                        <Text style={[tw("underline"), { color: returnHexCode(user.theme) }]}>Перейти</Text>
                     </TouchableOpacity>
                  </View>
               </Card>
            )}
         />
         <View style={tw("bg-red-100")}>
            <CustomInputField
               placeholder="Написать всем группам..."
               value={message}
               loading={loading}
               setValue={setMessage}
               onSubmit={sendMessageToAllGroups}
            />
         </View>
      </View>
   );
}
