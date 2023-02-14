import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { storage } from "../../../firebase";
import { NewDocument } from "../../../typings";
import { DB_PATHS } from "../../../typings/enums";
import { DOCS, createCollection } from "../../../utils/createDBQuery";

export const addMaterial = async (
   title: string,
   text: string,
   ownerId: string,
   disciplineId: string,
   documents: NewDocument[],
) => {
   await addDoc(createCollection(DB_PATHS.MATERIALS), {
      title,
      text,
      ownerId,
      likes: 0,
      disciplineId,
      timestamp: serverTimestamp(),
   }).then(async (snap) => {
      if (documents.length) {
         documents.map(async (document) => {
            await addDoc(createCollection(DB_PATHS.SOURCES), {
               title: document.name,
               materialId: snap.id,
            }).then(async (newDoc) => {
               const blob = await new Promise((resolve, reject) => {
                  const xhr = new XMLHttpRequest();
                  xhr.onload = () => {
                     resolve(xhr.response);
                  };
                  xhr.onerror = (e) => {
                     reject(new TypeError("Network request failed"));
                  };
                  xhr.responseType = "blob";
                  xhr.open("GET", document.uri, true);
                  xhr.send(null);
               });

               const docRef = ref(storage, `materials/${disciplineId}/${document.name}`);

               // @ts-ignore
               await uploadBytes(docRef, blob).then(async () => {
                  const downloadUrl = await getDownloadURL(docRef);

                  await updateDoc(DOCS.CREATE_DOC(DB_PATHS.SOURCES, newDoc.id), {
                     document: downloadUrl,
                  }).then(() => console.log("docs added!"));
               });
            });
         });
      }
   });
};
