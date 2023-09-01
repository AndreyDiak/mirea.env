import React, { useLayoutEffect, useRef, useState } from "react";

import { FlatList, Keyboard, Text } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { Card } from "@rneui/themed";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { Comment, Loader, ScreenTemplate } from "../components";
import { CustomInputField } from "../components/common/form/CustomInputField";
import { useComments } from "../features/hooks";
import { selectUser } from "../features/slices/userSlice";
import { useTheme } from "../hooks";
import type {
   Comment as CommentType,
   CommentsScreenNavigationProp,
   CommentsScreenRouteProp,
   Timestamp,
} from "../typings";
import { DB_PATHS } from "../typings/enums";
import { CommentPatcher, createCollection, isEmpty } from "../utils";

export function CommentsScreen() {
   const {
      params: { material },
   } = useRoute<CommentsScreenRouteProp>();

   const navigation = useNavigation<CommentsScreenNavigationProp>();
   const user = useSelector(selectUser);
   const tw = useTailwind();

   const { APP_THEME_BORDER, APP_THEME_TEXT, APP_THEME_SECONDARY, THEME_MAIN } = useTheme();

   const [commentText, setCommentText] = useState<string>("");
   const [loading, setLoading] = useState<boolean>(false);

   const flatListRef = useRef(null);

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: material.title,
      });
   });

   const { comments, loading: MLoading } = useComments(material.id);

   if (isEmpty(comments) && MLoading) {
      return <Loader text="Загрузка комментариев" theme={THEME_MAIN} />;
   }

   const addComment = async () => {
      if (isEmpty(commentText)) {
         return;
      }
      setLoading(true);
      Keyboard.dismiss();

      const comment: CommentType = {
         id: "",
         text: commentText.trim(),
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         // @ts-ignore
         timestamp: serverTimestamp() as Timestamp,
         ownerEmail: user.email,
      };

      const FBComment = CommentPatcher.toApiData(comment);

      await addDoc(createCollection(`${DB_PATHS.MATERIALS}/${material.id}/comments`), {
         ...FBComment,
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
