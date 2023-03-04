import { useEffect } from "react";

import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import { setUser } from "../../features/userSlice";
import { SuperUser, User } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { QUERIES } from "../../utils/createDBQuery";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUser = (initialUser: any) => {
   const dispatch = useDispatch();
   const q = QUERIES.CREATE_SIMPLE_QUERY<User>(DB_PATHS.USERS, {
      fieldName: "email",
      fieldValue: initialUser?.email || "",
      opStr: "==",
   });
   const [userSnap] = useCollection(q);

   useEffect(() => {
      if (!userSnap?.empty) {
         dispatch(
            setUser({
               ...userSnap?.docs[0].data(),
               id: userSnap?.docs[0].id,
            } as SuperUser),
         );
      }
   }, [dispatch, userSnap]);
};
