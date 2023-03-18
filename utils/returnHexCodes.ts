import { AppTheme } from "../typings";
import { APP_THEME } from "../typings/enums";
import {
   COLORS_100,
   COLORS_400,
   COLORS_600,
   COLORS_800,
   COLORS_THEME_FOR_BORDER,
   COLORS_THEME_MAIN,
   COLORS_THEME_MAIN_TEXT,
   COLORS_THEME_SECONDARY,
} from "./colors";

// type 100
export const returnLightenHexCode = (theme: AppTheme) => {
   switch (theme) {
      case "blue":
         return COLORS_100.BLUE;
      case "emerald":
         return COLORS_100.EMERALD;
      case "rose":
         return COLORS_100.ROSE;
      case "violet":
         return COLORS_100.VIOLET;
      default:
         return COLORS_100.BLUE;
   }
};

// type 400
export const returnHexCode = (theme: AppTheme) => {
   switch (theme) {
      case "blue":
         return COLORS_400.BLUE;
      case "emerald":
         return COLORS_400.EMERALD;
      case "rose":
         return COLORS_400.ROSE;
      case "violet":
         return COLORS_400.VIOLET;
      default:
         return COLORS_400.BLUE;
   }
};

// type 600
export const returnDarkenHexCode = (theme: AppTheme) => {
   switch (theme) {
      case "blue":
         return COLORS_600.BLUE;
      case "emerald":
         return COLORS_600.EMERALD;
      case "rose":
         return COLORS_600.ROSE;
      case "violet":
         return COLORS_600.VIOLET;
      default:
         return COLORS_600.BLUE;
   }
};

// type 800
export const returnDarkestHexCode = (theme: AppTheme) => {
   switch (theme) {
      case "blue":
         return COLORS_800.BLUE;
      case "emerald":
         return COLORS_800.EMERALD;
      case "rose":
         return COLORS_800.ROSE;
      case "violet":
         return COLORS_800.VIOLET;
      default:
         return COLORS_800.BLUE;
   }
};

export const returnAppTheme = (theme: APP_THEME) => {
   switch (theme) {
      case APP_THEME.LIGHT:
         return COLORS_THEME_MAIN.LIGHT;
      case APP_THEME.DARK:
         return COLORS_THEME_MAIN.DARK;
      default:
         return COLORS_THEME_MAIN.LIGHT;
   }
};
export const returnAppThemeText = (theme: APP_THEME) => {
   switch (theme) {
      case APP_THEME.LIGHT:
         return COLORS_THEME_MAIN_TEXT.LIGHT;
      case APP_THEME.DARK:
         return COLORS_THEME_MAIN_TEXT.DARK;
      default:
         return COLORS_THEME_MAIN_TEXT.LIGHT;
   }
};

export const returnAppThemeSecondary = (theme: APP_THEME) => {
   switch (theme) {
      case APP_THEME.LIGHT:
         return COLORS_THEME_SECONDARY.LIGHT;
      case APP_THEME.DARK:
         return COLORS_THEME_SECONDARY.DARK;
      default:
         return COLORS_THEME_SECONDARY.LIGHT;
   }
};

export const returnAppThemeForBorder = (theme: APP_THEME) => {
   switch (theme) {
      case APP_THEME.LIGHT:
         return COLORS_THEME_FOR_BORDER.LIGHT;
      case APP_THEME.DARK:
         return COLORS_THEME_FOR_BORDER.DARK;
      default:
         return COLORS_THEME_FOR_BORDER.LIGHT;
   }
};
