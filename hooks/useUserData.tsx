import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

export const useUserData = (email: string | null) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      if (email) {
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnap = await getDocs(q);
        const user = {
          ...querySnap.docs[0].data(),
          userId: querySnap.docs[0].id,
        };
        setUser(user);
      }
    };
    getUser();
  }, []);

  return user;
};
