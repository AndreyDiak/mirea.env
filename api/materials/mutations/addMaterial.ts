import { ToastAndroid } from "react-native";

import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { storage } from "../../../firebase";
import { Document, FBSource, Material, Timestamp } from "../../../typings";
import { DB_PATHS } from "../../../typings/enums";
import { MaterialPatcher } from "../../../utils/Patcher/MaterialPatcher";
import { createBlob } from "../../../utils/blob";
import { DOCS, createCollection } from "../../../utils/createDBQuery";

export const addMaterial = async (
   title: string,
   text: string,
   ownerId: string,
   disciplineId: string,
   documents: Document[],
) => {
   const material: Partial<Material> = {
      title,
      text,
      ownerId,
      likes: 0,
      disciplineId,
      timestamp: serverTimestamp() as unknown as Timestamp,
   };
   const FBMaterial = MaterialPatcher.toApiData(material);
   await addDoc(createCollection(DB_PATHS.MATERIALS), {
      ...FBMaterial,
   }).then(async (snap) => {
      // получаемя id материала который мы добавили в бд
      // если у нас есть прикрепленные документы то превращаем их в blob и прикрепляем к материалу
      if (documents.length) {
         documents.map(async (document) => {
            const data: Partial<FBSource> = {
               title: document.name,
               material_id: snap.id,
            };

            await addDoc(createCollection(DB_PATHS.SOURCES), {
               ...data,
            }).then(async (newDoc) => {
               const blob = await createBlob(document.uri);

               const docRef = ref(storage, `${DB_PATHS.MATERIALS}/${disciplineId}/${document.name}`);

               await uploadBytes(docRef, blob)
                  .then(async () => {
                     const downloadUrl = await getDownloadURL(docRef);

                     await updateDoc(DOCS.CREATE_DOC(DB_PATHS.SOURCES, newDoc.id), {
                        document: downloadUrl,
                     });
                  })
                  .then(() => ToastAndroid.show("Материалы загруженны", 1000))
                  .catch(() => ToastAndroid.show("Произошла ошибка!", 1000));
               // eslint-disable-next-line @typescript-eslint/ban-ts-comment
               // @ts-ignore
               blob.close();
            });
         });
      }
   });
};
