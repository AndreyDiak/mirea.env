import { useEffect, useState } from "react";

import { getAllData } from "../../api/queries/getAllData";
import { FBInstitute, Institute } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { InstituteConverter } from "../../utils/Converter/InstituteConverter";

export const useInstitutes = () => {
   const [institutes, setInstitutes] = useState<Institute[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         setLoading(true);
         const FBInstitutes = await getAllData<FBInstitute>(DB_PATHS.INSTITUTES);
         const Institutes = InstituteConverter.toData(FBInstitutes);
         setInstitutes(Institutes);
         setLoading(false);
      };

      getData();
   }, []);
   return { institutes, loading };
};
