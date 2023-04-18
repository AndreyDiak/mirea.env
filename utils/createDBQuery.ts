import {
   DocumentData,
   DocumentReference,
   Query,
   WhereFilterOp,
   collection,
   doc,
   query,
   where,
} from "firebase/firestore";

import { db } from "../firebase";
import { DB_PATHS } from "../typings/enums";

interface WhereParam<T> {
   fieldName: keyof T;
   fieldValue: T[keyof T];
   opStr: WhereFilterOp;
}

export const createCollection = (name: string) => collection(db, name);

export const QUERIES = {
   CREATE_SIMPLE_QUERY: <T>(collectionName: DB_PATHS, whereParam: WhereParam<T>): Query<DocumentData> =>
      query(
         createCollection(collectionName),
         where(whereParam.fieldName as string, whereParam.opStr, whereParam.fieldValue),
      ),
   CREATE_MULTIPLE_QUERY: <T>(collectionName: DB_PATHS, whereParam: WhereParam<T>[]): Query<DocumentData> =>
      query(
         createCollection(collectionName),
         where(whereParam[0].fieldName as string, whereParam[0].opStr, whereParam[0].fieldValue),
         where(whereParam[1].fieldName as string, whereParam[1].opStr, whereParam[1].fieldValue),
      ),
};

export const DOCS = {
   CREATE_DOC: (collectionName: DB_PATHS, docId: string): DocumentReference<DocumentData> =>
      doc(db, `${collectionName}/${docId}`),
};
