import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Card, Icon } from "@rneui/themed";
import {
  addDoc,
  collection, onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where
} from "firebase/firestore";
import React, { useLayoutEffect, useRef, useState } from "react";
import {
  FlatList, Keyboard, Text, TextInput,
  TouchableOpacity, View
} from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import Comment from "../components/Comment";
import { getUser } from "../features/userSlice";
import { db } from "../firebase";

type Props = {};

type CommentsScreenRouteProp = RouteProp<RootStackParamList, "Comments">;

const CommentsScreen = (props: Props) => {
  const navigation = useNavigation<CommentsScreenNavigatorProp>();
  const user = useSelector(getUser);
  const {
    params: { material },
  } = useRoute<CommentsScreenRouteProp>();

  const tw = useTailwind();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(material.comments);

  const flatListRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: material.title,
    });
  });

  const q = query(
    collection(db, "comments"),
    where("materialId", "==", material.materialId),
    orderBy("timestamp")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const commentsSnap = snapshot.docs.map((comment) => ({
      ...comment.data(),
      commentId: comment.id,
    }));
    if (comments.length !== commentsSnap.length) {
      setComments(commentsSnap as Comment[]);
    }
  });

  const addComment = async () => {
    if (commentText.length === 0) {
      return;
    }
    Keyboard.dismiss();
    await addDoc(collection(db, "comments"), {
      email: user?.email,
      text: commentText,
      timestamp: serverTimestamp(),
      materialId: material.materialId,
    }).then((res) => {
      setCommentText("");
      // @ts-ignore workable ref
      flatListRef.current.scrollToEnd({ animating: true });
    });
  };

  return (
    <View style={tw("flex flex-col h-full w-full py-4")}>
      <Card containerStyle={tw("my-0")}>
        <Card.Title>{material.title}</Card.Title>
        <Text>{material.text}</Text>
      </Card>
      <Text style={tw("text-lg text-center my-4")}>
        Комментарии ({comments.length})
      </Text>
      <FlatList
        // @ts-ignore workable ref
        ref={flatListRef}
        data={comments}
        style={tw("w-10/12 mx-auto my-2")}
        showsVerticalScrollIndicator={false}
        renderItem={(item) => (
          <Comment
            key={item.index}
            comment={item.item}
            index={item.index}
            isLast={item.index === comments.length - 1}
          />
        )}
      />
      <View style={tw("flex flex-row items-center justify-center px-2")}>
        <TextInput
          placeholder="Введите комментарий..."
          value={commentText}
          onChangeText={setCommentText}
          style={tw("bg-white px-3 py-2 w-10/12 mr-4 mx-auto rounded-lg")}
        />
        <TouchableOpacity onPress={addComment}>
          <Icon name="send" type="material" color="#60a5fa" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentsScreen;
