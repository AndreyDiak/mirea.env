import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { storage } from "../../../firebase";
import { Document, FBSource, Material, Timestamp } from "../../../typings";
import { DB_PATHS } from "../../../typings/enums";
import { MaterialPatcher } from "../../../utils/Patcher/MaterialPatcher";
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
      if (documents.length) {
         documents.map(async (document) => {
            const data: Omit<FBSource, "document"> = {
               title: document.name,
               material_id: snap.id,
            };

            await addDoc(createCollection(DB_PATHS.SOURCES), {
               ...data,
            }).then(async (newDoc) => {
               const blob = await new Promise((resolve, reject) => {
                  const xhr = new XMLHttpRequest();
                  xhr.onload = () => {
                     resolve(xhr.response);
                  };
                  xhr.onerror = () => {
                     reject(new TypeError("Network request failed"));
                  };
                  xhr.responseType = "blob";
                  xhr.open("GET", document.uri, true);
                  xhr.send(null);
               });

               const docRef = ref(storage, `materials/${disciplineId}/${document.name}`);

               await uploadBytes(docRef, blob as Blob | Uint8Array | ArrayBuffer).then(async () => {
                  const downloadUrl = await getDownloadURL(docRef);

                  await updateDoc(DOCS.CREATE_DOC(DB_PATHS.SOURCES, newDoc.id), {
                     document: downloadUrl,
                  });
               });
            });
         });
      }
   });
};
