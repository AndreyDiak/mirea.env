/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from "react";

import { ToastAndroid, TouchableOpacity, View } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { db, storage } from "../../firebase";
import { UserProfileAvatar } from "../common";

interface Props {
   id: string;
   userImg: string;
   userName: string;
}

export const ProfileImage: React.FC<Props> = React.memo(({ id, userImg, userName }) => {
   const [profileImage, setProfileImage] = useState<string>(null);

   const pickImage = async () => {
      await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [3, 3],
         quality: 1,
      }).then(async (image) => {
         if (!image.cancelled) {
            // @ts-ignore
            setProfileImage(image.uri);
            const blob = await new Promise((resolve, reject) => {
               const xhr = new XMLHttpRequest();
               xhr.onload = () => {
                  resolve(xhr.response);
               };
               xhr.onerror = () => {
                  reject(new TypeError("Network request failed"));
               };
               xhr.responseType = "blob";
               // @ts-ignore
               xhr.open("GET", image.uri, true);
               xhr.send(null);
            });

            const imageRef = ref(storage, `users/${id}/image`);
            // @ts-ignore
            await uploadBytes(imageRef, blob)
               .then(async () => {
                  const downloadUrl = await getDownloadURL(imageRef);
                  await updateDoc(doc(db, "users", id), {
                     img: downloadUrl,
                  }).then(() => ToastAndroid.show("Фото обновлено!", 1000));
               })
               .catch(() => ToastAndroid.show("Произошла ошибка!", 1000));
            // @ts-ignore
            blob.close();
         }
      });
   };
   return (
      <View>
         <TouchableOpacity onPress={pickImage}>
            {userImg !== "" || profileImage ? (
               <UserProfileAvatar source={profileImage || userImg} />
            ) : (
               <UserProfileAvatar title={userName[0]} />
            )}
         </TouchableOpacity>
      </View>
   );
});
