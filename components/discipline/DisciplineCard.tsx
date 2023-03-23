import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Card, Icon } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUser } from "../../features/userSlice";
import { useChat, useTheme } from "../../hooks";
import type { Discipline, DisciplineScreenNavigationProp } from "../../typings";
import { APP_THEME, USER_TYPE } from "../../typings/enums";

type Props = {
   discipline: Discipline;
};

export function DisciplineCard({ discipline }: Props) {
   const tw = useTailwind();
   const navigation = useNavigation<DisciplineScreenNavigationProp>();
   const user = useSelector(selectUser);

   const { APP_THEME_BORDER, APP_THEME_SECONDARY, APP_THEME_TEXT, THEME_MAIN } = useTheme();

   const { chat, loading } = useChat(discipline.id);

   return (
      <Card
         containerStyle={{
            backgroundColor: APP_THEME_SECONDARY,
            borderColor: APP_THEME_BORDER,
            borderWidth: user.appTheme === APP_THEME.LIGHT ? 1 : 0,
            borderRadius: 5,
         }}
      >
         <Card.Title
            style={[
               tw("font-bold"),
               {
                  color: APP_THEME_TEXT,
               },
            ]}
         >
            {discipline.name}
         </Card.Title>
         <Card.Divider />
         <View style={tw("flex flex-row justify-between")}>
            <TouchableOpacity
               style={tw("flex flex-row items-center")}
               onPress={() => navigation.navigate("Discipline", { discipline })}
            >
               <Text
                  style={[
                     tw("underline font-bold mr-2"),
                     {
                        color: THEME_MAIN,
                     },
                  ]}
               >
                  Материалы
               </Text>
               <Icon name="inventory" type="material" color={THEME_MAIN} />
            </TouchableOpacity>

            <TouchableOpacity
               style={tw("flex flex-row items-center")}
               onPress={() =>
                  // если пользователь быстро нажал,
                  // (до того как загрузился chatId, то мы должны делать лоадер)
                  // "загрузка чата" или "создание чата"
                  !loading && user.type === USER_TYPE.STUDENT
                     ? navigation.navigate("Chat", {
                          chatId: chat?.id,
                          groupName: chat.groupName,
                       })
                     : navigation.navigate("Chats", { discipline })
               }
            >
               <Text
                  style={[
                     // tw("font-bold text-gray-600 mr-2"),
                     tw("font-bold mr-2"),
                     {
                        color: APP_THEME_TEXT,
                     },
                  ]}
               >
                  Перейти в чат
               </Text>
               <Icon name="textsms" type="material" color={APP_THEME_TEXT} />
            </TouchableOpacity>
         </View>
      </Card>
   );
}
