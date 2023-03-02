import React, { useLayoutEffect, useRef, useState } from "react";

import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Card, Icon } from "@rneui/themed";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { Comment, Loader } from "../components";
import { selectUser } from "../features/userSlice";
import { useMaterialComments } from "../hooks";
import type { CommentsScreenNavigatorProp, RootStackParamList } from "../typings";
import { DB_PATHS } from "../typings/enums";
import { createCollection, isEmpty, returnHexCode } from "../utils";

type CommentsScreenRouteProp = RouteProp<RootStackParamList, "Comments">;

export function CommentsScreen() {
   const navigation = useNavigation<CommentsScreenNavigatorProp>();
   const user = useSelector(selectUser);
   const {
      params: { material },
   } = useRoute<CommentsScreenRouteProp>();

   const tw = useTailwind();
   const [commentText, setCommentText] = useState("");

   const flatListRef = useRef(null);

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: material.title,
      });
   });

   const { comments, loading } = useMaterialComments(material.id);

   if (isEmpty(comments) && loading) {
      return <Loader text="Загрузка комментариев" theme={user.theme} />;
   }

   const renderCommentsList = () => {
      if (isEmpty(comments)) {
         return <Text style={tw("text-center my-2")}>Напишите первый комментарий...</Text>;
      }
      return (
         <FlatList
            ref={flatListRef}
            data={comments}
            style={tw("w-10/12 mx-auto my-2")}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: comment, index }) => (
               <Comment
                  key={comment.id}
                  comment={comment}
                  index={index}
                  isLast={index === comments.length - 1}
               />
            )}
         />
      );
   };

   const addComment = async () => {
      if (isEmpty(commentText)) {
         return;
      }
      Keyboard.dismiss();
      await addDoc(createCollection(DB_PATHS.COMMENTS), {
         email: user?.email,
         text: commentText,
         timestamp: serverTimestamp(),
         materialId: material.id,
      }).then(() => {
         setCommentText("");
         flatListRef.current?.scrollToEnd({ animating: true });
      });
   };

   return (
      <View style={tw("flex flex-col h-full w-full py-4")}>
         <Card containerStyle={tw("my-0")}>
            <Card.Title>{material.title}</Card.Title>
            <Text>{material.text}</Text>
         </Card>
         <Text style={tw("text-lg text-center my-4")}>Комментарии ({comments.length})</Text>
         {renderCommentsList()}
         <View style={tw("flex flex-row items-center justify-center px-2")}>
            <TextInput
               placeholder="Введите комментарий..."
               value={commentText}
               onChangeText={setCommentText}
               style={tw("bg-white px-3 py-2 w-10/12 mr-4 mx-auto rounded-lg")}
            />
            <TouchableOpacity onPress={addComment}>
               <Icon name="send" type="material" color={returnHexCode(user.theme)} size={30} />
            </TouchableOpacity>
         </View>
      </View>
   );
}
