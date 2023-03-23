import { useCallback, useMemo, useState } from "react";

import { ADMIN_MODE } from "../../typings/enums";

export const useAdminMode = () => {
   const [mode, setMode] = useState<ADMIN_MODE>(null);

   const close = useCallback(() => {
      setMode(null);
   }, []);

   const open = useCallback((newMode: ADMIN_MODE) => {
      setMode(newMode);
   }, []);

   return useMemo(() => {
      return {
         mode,
         close,
         open,
      };
   }, [close, mode, open]);
};
