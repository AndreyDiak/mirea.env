import { useCallback, useEffect } from "react";

import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import { DB_PATHS } from "../../typings/enums";
import { FBAppUser } from "../../typings/types/user";
import { QUERIES, UserConverter } from "../../utils";
import { isEmpty } from "../../utils/isEmpty";
import { setUser } from "../slices/userSlice";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUser = (initialUser: any) => {
   const dispatch = useDispatch();
   const q = QUERIES.CREATE_SIMPLE_QUERY<FBAppUser>(DB_PATHS.USERS, {
      fieldName: "email",
      fieldValue: initialUser?.email || "",
      opStr: "==",
   });
   // useCollection нужен для того, чтобы подгружать изменения в runtime
   // например аватар и тд
   const [snapshot] = useCollection(q);

   const loadUser = useCallback(() => {
      const rawUser = {
         id: snapshot?.docs[0]?.id,
         ...snapshot?.docs[0].data(),
      } as FBAppUser;

      const user = UserConverter.toData(rawUser);

      if (!isEmpty(user)) {
         dispatch(setUser(user));
      }
   }, [dispatch, snapshot?.docs]);

   useEffect(() => {
      if (snapshot?.empty) {
         return;
      }
      loadUser();
   }, [dispatch, loadUser, snapshot?.empty]);
};
