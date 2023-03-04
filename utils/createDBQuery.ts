import {
   DocumentData,
   DocumentReference,
   Query,
   WhereFilterOp,
   collection,
   doc,
   orderBy,
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

interface OrderByParam<T> {
   fieldValue: keyof T;
}

export const createCollection = (name: string) => collection(db, name);

export const QUERIES = {
   CREATE_SIMPLE_QUERY: <T>(collectionName: DB_PATHS, whereParam: WhereParam<T>): Query<DocumentData> =>
      query(
         createCollection(collectionName),
         where(whereParam.fieldName as string, whereParam.opStr, whereParam.fieldValue),
      ),
   CREATE_MULTIPLE_QUERY: <T>(
      collectionName: DB_PATHS,
      whereParam: WhereParam<T>[], // максимум 2 where
   ): Query<DocumentData> =>
      query(
         createCollection(collectionName),
         where(whereParam[0].fieldName as string, whereParam[0].opStr, whereParam[0].fieldValue),
         where(whereParam[1].fieldName as string, whereParam[1].opStr, whereParam[1].fieldValue),
      ),
   CREATE_SIMPLE_QUERY_ORDERED: <T>(
      collectionName: DB_PATHS,
      whereParam: WhereParam<T>, // максимум 2 where
      orderByParam: OrderByParam<T>,
   ): Query<DocumentData> =>
      query(
         createCollection(collectionName),
         where(whereParam.fieldName as string, whereParam.opStr, whereParam.fieldValue),
         orderBy(orderByParam.fieldValue as string),
      ),
   CREATE_MULTIPLE_QUERY_ORDERED: <T>(
      collectionName: DB_PATHS,
      whereParam: WhereParam<T>[],
      orderByParam: OrderByParam<T>,
   ): Query<DocumentData> =>
      query(
         createCollection(collectionName),
         where(whereParam[0].fieldName as string, whereParam[0].opStr, whereParam[0].fieldValue),
         where(whereParam[1].fieldName as string, whereParam[1].opStr, whereParam[1].fieldValue),
         orderBy(orderByParam.fieldValue as string),
      ),
};

export const DOCS = {
   CREATE_DOC: (collectionName: DB_PATHS, docId: string): DocumentReference<DocumentData> =>
      doc(db, `${collectionName}/${docId}`),
};
