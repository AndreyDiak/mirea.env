import { useEffect, useMemo } from "react";

import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import { setUser } from "../../features/userSlice";
import { DB_PATHS } from "../../typings/enums";
import { FBAppUser } from "../../typings/types/user";
import { QUERIES, UserConverter } from "../../utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUser = (initialUser: any) => {
   const dispatch = useDispatch();
   const q = QUERIES.CREATE_SIMPLE_QUERY<FBAppUser>(DB_PATHS.USERS, {
      fieldName: "email",
      fieldValue: initialUser?.email || "",
      opStr: "==",
   });
   const [userSnap] = useCollection(q);

   const FBUser = useMemo(
      () =>
         ({
            id: userSnap.docs[0].id,
            ...userSnap.docs[0].data(),
         } as FBAppUser),
      [userSnap.docs],
   );

   const User = useMemo(() => UserConverter.toData(FBUser), [FBUser]);

   useEffect(() => {
      if (!userSnap?.empty) {
         dispatch(setUser(User));
      }
   }, [User, dispatch, userSnap]);
};
