import { useState } from "react";

import { ADMIN_MODE } from "../../typings/enums";

export const useAdminMode = () => {
   const [mode, setMode] = useState<ADMIN_MODE>(null);

   const close = () => {
      setMode(null);
   };

   const open = (newMode: ADMIN_MODE) => {
      setMode(newMode);
   };

   return { mode, close, open };
};
