import { useCallback, useEffect } from "react";

import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";

import { DB_PATHS } from "../../typings/enums";
import { FBAppUser } from "../../typings/types/user";
import { QUERIES, UserConverter } from "../../utils";
import { deepCompare } from "../../utils/deepCompare";
import { selectUser, setUser } from "../slices/userSlice";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUser = (initialUser: any, setLoading: (isLoading: boolean) => void) => {
   const dispatch = useDispatch();
   const rawUser = useSelector(selectUser);

   const q = QUERIES.CREATE_SIMPLE_QUERY<FBAppUser>(DB_PATHS.USERS, {
      fieldName: "email",
      fieldValue: initialUser?.email || "",
      opStr: "==",
   });
   // useCollection нужен для того, чтобы подгружать изменения в runtime
   // например аватар и тд
   const [snapshot] = useCollection(q);

   const loadUser = useCallback(() => {
      const fbUser = {
         id: snapshot?.docs[0]?.id,
         ...snapshot?.docs[0]?.data(),
      } as FBAppUser;

      const user = UserConverter.toData(fbUser);

      if (!deepCompare(user, rawUser)) {
         dispatch(setUser(user));
         setLoading(false);
      }
   }, [dispatch, rawUser, setLoading, snapshot?.docs]);

   useEffect(() => {
      if (snapshot?.empty) {
         setLoading(false);
         return;
      }
      loadUser();
   }, [dispatch, loadUser, rawUser, setLoading, snapshot?.empty]);
};
