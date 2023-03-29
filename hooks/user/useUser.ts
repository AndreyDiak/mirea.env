import { useEffect } from "react";

import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import { setUser } from "../../features/slices/userSlice";
import { DB_PATHS } from "../../typings/enums";
import { FBAppUser } from "../../typings/types/user";
import { QUERIES, UserConverter } from "../../utils";
import { isEmpty } from "../../utils/isEmpty";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUser = (initialUser: any) => {
   const dispatch = useDispatch();
   const q = QUERIES.CREATE_SIMPLE_QUERY<FBAppUser>(DB_PATHS.USERS, {
      fieldName: "email",
      fieldValue: initialUser?.email || "",
      opStr: "==",
   });
   const [userSnap] = useCollection(q);

   useEffect(() => {
      if (userSnap?.empty) {
         return;
      }

      const FBUser = {
         id: userSnap?.docs[0]?.id,
         ...userSnap?.docs[0].data(),
      } as FBAppUser;

      const User = UserConverter.toData(FBUser);
      if (!isEmpty(User)) {
         dispatch(setUser(User));
      }
   }, [dispatch, userSnap]);
};
