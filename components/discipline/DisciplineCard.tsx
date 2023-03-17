import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Card, Icon } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUser } from "../../features/userSlice";
import { useChat } from "../../hooks";
import type { Discipline, DisciplineScreenNavigatorProp } from "../../typings";
import { APP_THEME, UType } from "../../typings/enums";
import {
   returnAppThemeSecondary,
   returnAppThemeText,
   returnAppThemeForBorder,
   returnHexCode,
} from "../../utils";

type Props = {
   discipline: Discipline;
};

export function DisciplineCard({ discipline }: Props) {
   const tw = useTailwind();
   const navigation = useNavigation<DisciplineScreenNavigatorProp>();
   const user = useSelector(selectUser);

   const { chat, loading } = useChat(discipline.id);

   return (
      <Card
         containerStyle={{
            backgroundColor: returnAppThemeSecondary(user.appTheme),
            borderColor: returnAppThemeForBorder(user.appTheme),
            borderWidth: user.appTheme === APP_THEME.LIGHT ? 1 : 0,
            borderRadius: 5,
         }}
      >
         <Card.Title
            style={[
               tw("font-bold"),
               {
                  color: returnAppThemeText(user.appTheme),
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
                        color: returnHexCode(user.theme),
                     },
                  ]}
               >
                  Материалы
               </Text>
               <Icon name="inventory" type="material" color={returnHexCode(user.theme)} />
            </TouchableOpacity>

            <TouchableOpacity
               style={tw("flex flex-row items-center")}
               onPress={() =>
                  // если пользователь быстро нажал,
                  // (до того как загрузился chatId, то мы должны делать лоадер)
                  // "загрузка чата" или "создание чата"
                  !loading && user.type === UType.STUDENT
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
                        color: returnAppThemeText(user.appTheme),
                     },
                  ]}
               >
                  Перейти в чат
               </Text>
               <Icon name="textsms" type="material" color={returnAppThemeText(user.appTheme)} />
            </TouchableOpacity>
         </View>
      </Card>
   );
}
