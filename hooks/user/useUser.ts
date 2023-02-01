import { useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/userSlice";
import { SuperUser, User } from "../../typings";
import { DBQueries } from "../../typings/enums";
import { QUERIES } from "../../utils/createDBQuery";

export const useUser = (initialUser: any) => {
  const dispatch = useDispatch();
  const q = QUERIES.CREATE_SIMPLE_QUERY<User>(DBQueries.USERS, {
    fieldName: "email",
    fieldValue: initialUser?.email || "",
    opStr: "==",
  });
  const [userSnap, loading, error] = useCollection(q);

  useEffect(() => {
    if (!userSnap?.empty) {
      dispatch(
        setUser({
          ...userSnap?.docs[0].data(),
          userId: userSnap?.docs[0].id,
        } as SuperUser)
      );
    }
  }, [userSnap]);
};
