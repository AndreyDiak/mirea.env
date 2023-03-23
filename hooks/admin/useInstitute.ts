import { useCallback, useEffect, useMemo, useState } from "react";

import { ToastAndroid } from "react-native";

import { addDoc } from "firebase/firestore";

import { DB_PATHS } from "../../typings/enums";
import { createCollection } from "../../utils/createDBQuery";
import { isEmpty } from "../../utils/isEmpty";

export const useInstitute = () => {
   const [fullName, setFullName] = useState<string>("");
   const [shortName, setShortName] = useState<string>("");
   const [isLoading, setIsLoading] = useState(false);
   const [isError, setIsError] = useState(false);

   const addInstitute = useCallback(async () => {
      if (isEmpty(fullName) || isEmpty(shortName)) {
         setIsError(true);
         return;
      }
      setIsLoading(true);

      await addDoc(createCollection(DB_PATHS.INSTITUTES), {
         name: fullName,
         shortName,
      }).then(() => ToastAndroid.show("Институт добавлен!", 1000));

      setIsLoading(false);
      setFullName("");
      setShortName("");
   }, [fullName, shortName]);

   useEffect(() => {
      if (isError) {
         if (!isEmpty(fullName) && !isEmpty(shortName)) {
            setIsError(false);
         }
      }
   }, [fullName, isError, shortName]);

   return useMemo(() => {
      return { fullName, setFullName, shortName, setShortName, isLoading, isError, addInstitute };
   }, [addInstitute, fullName, isError, isLoading, shortName]);
};
