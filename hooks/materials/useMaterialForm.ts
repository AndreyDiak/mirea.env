import { useCallback, useMemo, useState } from "react";

import * as DocumentPicker from "expo-document-picker";

import { addMaterial } from "../../api";
import { Document } from "../../typings";

interface UseMaterialForm {
   text: string;
   title: string;
   error: string;
   isLoading: boolean;
   documents: Document[];

   setText(text: string): void;
   setTitle(title: string): void;
   addDocument(): Promise<void>;
   submitForm(): Promise<void>;
   setDocuments(documents: Document[]): void;
}

export function useMaterialForm(userId: string, disciplineId: string): UseMaterialForm {
   const [isLoading, setIsLoading] = useState(false);
   const [title, setTitle] = useState("");
   const [text, setText] = useState("");
   const [documents, setDocuments] = useState<Document[]>([]);
   const [error, setError] = useState("");

   const addDocument = useCallback(async () => {
      await DocumentPicker.getDocumentAsync({
         multiple: true,
         copyToCacheDirectory: false,
      }).then(async (docs) => {
         if (docs.type === "success") {
            const document: Document = {
               name: docs.name,
               uri: docs.uri,
               type: docs.mimeType,
            };
            const documentsCopy = [...documents];
            documentsCopy.push(document);
            setDocuments(documentsCopy);
         }
      });
   }, [documents]);

   const submitForm = useCallback(async () => {
      if (!text || !title) {
         setError("Заполните все поля!");
         return;
      }

      setIsLoading(true);
      await addMaterial(title, text, userId, disciplineId, documents);
      setIsLoading(false);

      setDocuments([]);

      setText("");
      setTitle("");
   }, [disciplineId, documents, text, title, userId]);

   return useMemo(() => {
      return {
         text,
         title,
         error,
         isLoading,
         documents,

         setText,
         setTitle,
         addDocument,
         submitForm,
         setDocuments,
      };
   }, [addDocument, documents, error, isLoading, submitForm, text, title]);
}
