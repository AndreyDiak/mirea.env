import React, { useMemo } from "react";

import { ToastAndroid, TouchableOpacity, View } from "react-native";

import { Icon } from "@rneui/themed";
import * as Clipboard from "expo-clipboard";
import { deleteDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUser } from "../../features/userSlice";
import type { DBMessage } from "../../typings";
import { APP_THEME, DB_PATHS } from "../../typings/enums";
import { DOCS, returnAppThemeText } from "../../utils";

interface Props {
   chatId: string;
   selectedMessage: DBMessage;
   onClose: () => void;
   replyOnMessage: () => void;
   editMessage: () => void;
}

export const ChatHeader: React.FC<Props> = React.memo(
   ({ selectedMessage, chatId, onClose, replyOnMessage, editMessage }) => {
      const tw = useTailwind();
      const user = useSelector(selectUser);

      const copyToClipboard = async () => {
         await Clipboard.setStringAsync(selectedMessage.text).then(() => {
            ToastAndroid.show("Скопировано в буфер обмена", 1000);
         });
         onClose();
      };

      const deleteMessage = async () => {
         await deleteDoc(DOCS.CREATE_DOC(DB_PATHS.CHATS, `${chatId}/messages/${selectedMessage.id}`)).then(
            () => {
               ToastAndroid.show("Сообщение удалено", 1000);
            },
         );
         onClose();
      };

      const isMyMessage = useMemo(
         () => selectedMessage?.email === user.email,
         [selectedMessage?.email, user.email],
      );

      const iconColor = user.appTheme === APP_THEME.LIGHT ? "#374151" : returnAppThemeText(user.appTheme);

      return (
         <View style={tw("flex flex-row")}>
            {isMyMessage ? (
               <TouchableOpacity onPress={editMessage} style={tw("mr-4")}>
                  <Icon name="edit" type="material" size={30} color={iconColor} />
               </TouchableOpacity>
            ) : null}
            <TouchableOpacity onPress={copyToClipboard} style={tw("mr-4")}>
               <Icon name="content-copy" type="material" size={30} color={iconColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={replyOnMessage} style={tw("mr-4")}>
               <Icon name="redo" type="material" size={30} color={iconColor} />
            </TouchableOpacity>
            {isMyMessage ? (
               <TouchableOpacity onPress={deleteMessage} style={tw("mr-4")}>
                  <Icon name="delete-outline" type="material" size={30} color={iconColor} />
               </TouchableOpacity>
            ) : null}
         </View>
      );
   },
);
