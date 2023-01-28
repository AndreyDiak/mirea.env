import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const addMaterial = async (
  title: string,
  text: string,
  ownerId: string,
  disciplineId: string,
  documents: NewDocument[]
) => {
  await addDoc(collection(db, "materials"), {
    title,
    text,
    ownerId,
    likes: 0,
    disciplineId,
    timestamp: serverTimestamp(),
  }).then(async (snap) => {
    if (documents.length) {
      documents.map(async (document) => {
        await addDoc(collection(db, `materials/${snap.id}/sources`), {
          title: document.name,
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

          const docRef = ref(
            storage,
            `materials/${disciplineId}/${document.name}`
          );

          // @ts-ignore
          await uploadBytes(docRef, blob).then(async () => {
            const downloadUrl = await getDownloadURL(docRef);

            await updateDoc(
              doc(db, `materials/${snap.id}/sources/${newDoc.id}`),
              {
                document: downloadUrl,
              }
            ).then(() => console.log("docs added!"));
          });
        });
      });
    }
  });
};
