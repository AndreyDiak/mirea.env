import { useSelector } from "react-redux";

import { selectUserAppTheme, selectUserTheme } from "../../features/userSlice";
import { returnAppThemeText } from "../../utils";
import {
   returnAppTheme,
   returnAppThemeForBorder,
   returnAppThemeSecondary,
   returnDarkenHexCode,
   returnHexCode,
} from "../../utils/returnHexCodes";

export const useTheme = () => {
   // user main theme
   const THEME = useSelector(selectUserTheme);
   // user app theme
   const APP_THEME = useSelector(selectUserAppTheme);
   // app theme colors
   const APP_THEME_TEXT = returnAppThemeText(APP_THEME);
   const APP_THEME_MAIN = returnAppTheme(APP_THEME);
   const APP_THEME_SECONDARY = returnAppThemeSecondary(APP_THEME);
   const APP_THEME_BORDER = returnAppThemeForBorder(APP_THEME);
   // theme color
   const THEME_MAIN = returnHexCode(THEME);
   const THEME_DARKEN = returnDarkenHexCode(THEME);

   return {
      APP_THEME_MAIN,
      APP_THEME_SECONDARY,
      APP_THEME_TEXT,
      APP_THEME_BORDER,
      THEME,
      APP_THEME,
      THEME_MAIN,
      THEME_DARKEN,
   };
};
