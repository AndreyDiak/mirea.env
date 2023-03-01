import { useEffect, useState } from "react";

import { getAllData } from "../../api/queries/getAllData";
import { Institute } from "../../typings";
import { DB_PATHS } from "../../typings/enums";

export const useInstitutes = () => {
   const [institutes, setInstitutes] = useState<Institute[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         setLoading(true);
         const DBInstitutes = await getAllData<Institute>(DB_PATHS.INSTITUTES);

         setInstitutes(DBInstitutes);
         setLoading(false);
      };

      getData();
   }, []);
   return { institutes, loading };
};
