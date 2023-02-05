import { useEffect, useState } from "react";

import { getAllData } from "../../api/queries/getAllData";
import { Institute } from "../../typings";
import { DBQueries } from "../../typings/enums";

export const useInstitutes = () => {
   const [institutes, setInstitutes] = useState<Institute[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         setLoading(true);
         const DBInstitutes = await getAllData<Institute>(DBQueries.INSTITUTES);

         setInstitutes(DBInstitutes);
         setLoading(false);
      };

      getData();
   }, []);
   return { institutes, loading };
};
