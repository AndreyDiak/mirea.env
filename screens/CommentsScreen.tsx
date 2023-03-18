import React, { useLayoutEffect, useRef, useState } from "react";

import { FlatList, Keyboard, Text } from "react-native";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Card } from "@rneui/themed";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { Comment, Loader, ScreenTemplate } from "../components";
import { CustomInputField } from "../components/common/form/CustomInputField";
import { selectUser } from "../features/userSlice";
import { useMaterialComments, useTheme } from "../hooks";
import type { CommentsScreenNavigatorProp, RootStackParamList } from "../typings";
import { DB_PATHS } from "../typings/enums";
import { createCollection, isEmpty } from "../utils";

type CommentsScreenRouteProp = RouteProp<RootStackParamList, "Comments">;

export function CommentsScreen() {
   const {
      params: { material },
   } = useRoute<CommentsScreenRouteProp>();

   const navigation = useNavigation<CommentsScreenNavigatorProp>();
   const user = useSelector(selectUser);
   const tw = useTailwind();

   const { APP_THEME_BORDER, APP_THEME_TEXT, APP_THEME_SECONDARY } = useTheme();

   const [commentText, setCommentText] = useState<string>("");
   const [loading, setLoading] = useState<boolean>(false);

   const flatListRef = useRef(null);

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: material.title,
      });
   });

   const { comments, loading: MLoading } = useMaterialComments(material.id);

   if (isEmpty(comments) && MLoading) {
      return <Loader text="Загрузка комментариев" theme={user.theme} />;
   }

   const addComment = async () => {
      if (isEmpty(commentText)) {
         return;
      }
      setLoading(true);
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
      setLoading(false);
   };

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

   return (
      <ScreenTemplate style={tw("py-4")}>
         <>
            <Card
               containerStyle={{
                  backgroundColor: APP_THEME_SECONDARY,
                  borderColor: APP_THEME_BORDER,
               }}
            >
               <Card.Title style={{ color: APP_THEME_TEXT }}>{material.title}</Card.Title>
               <Text
                  style={{
                     color: APP_THEME_TEXT,
                  }}
               >
                  {material.text}
               </Text>
            </Card>
            <Text
               style={[
                  tw("text-lg text-center my-4"),
                  {
                     color: APP_THEME_TEXT,
                  },
               ]}
            >
               Комментарии ({comments.length})
            </Text>
            {renderCommentsList()}
            <CustomInputField
               value={commentText}
               loading={loading}
               setValue={setCommentText}
               onSubmit={addComment}
            />
         </>
      </ScreenTemplate>
   );
}
