/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback, useMemo, useState } from "react";

import { ToastAndroid } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { db, storage } from "../../firebase";
import { createBlob } from "../../utils/blob";

interface UseProfileImage {
   pickImage(): void;
   profileImage: string;
}

export function useProfileImage(id: string): UseProfileImage {
   const [profileImage, setProfileImage] = useState<string>(null);

   const pickImage = useCallback(async () => {
      await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [3, 3],
         quality: 1,
      }).then(async (image) => {
         if (!image.cancelled) {
            // @ts-ignore
            setProfileImage(image.uri);
            // @ts-ignore
            const blob = await createBlob(image.uri as string);

            const imageRef = ref(storage, `users/${id}/image`);

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
   }, [id]);

   return useMemo(() => {
      return {
         pickImage,
         profileImage,
      };
   }, [pickImage, profileImage]);
}
