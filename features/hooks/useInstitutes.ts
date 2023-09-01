import { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getAllData } from "../../api/queries/getAllData";
import { RootState } from "../../store";
import { FBInstitute, Institute, UseCustomHook } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { isEmpty } from "../../utils";
import { InstituteConverter } from "../../utils/Converter/InstituteConverter";
import { selectInstitutes, setInstitutes } from "../slices/institutesSlice";

/*
 * загружает все институты из firebase
 */

interface UseInstitutes extends UseCustomHook {
   institutes: Institute[];
}

export function useInstitutes(): UseInstitutes {
   // const [institutes, setInstitutes] = useState<Institute[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   const dispatch = useDispatch();

   const rawInstitutesSelector = useCallback((s: RootState) => selectInstitutes(s), []);
   const rawInstitutes = useSelector(rawInstitutesSelector);

   const loadInstitutes = useCallback(async () => {
      setLoading(true);

      const institutes = await getAllData<FBInstitute>(DB_PATHS.INSTITUTES);

      dispatch(setInstitutes({ institutes }));
      setLoading(false);
   }, [dispatch]);

   useEffect(() => {
      if (isEmpty(rawInstitutes)) {
         loadInstitutes();
      }
   }, [loadInstitutes, rawInstitutes]);

   return useMemo(() => {
      return {
         institutes: rawInstitutes ? InstituteConverter.toData(rawInstitutes) : [],
         loading,
      };
   }, [loading, rawInstitutes]);
}
