import { AppTheme } from "../typings";
import { APP_THEME } from "../typings/enums";

// type 100
export const returnLightenHexCode = (theme: AppTheme) => {
   switch (theme) {
      case "blue":
         return "#dbeafe";
      case "emerald":
         return "#d1fae5";
      case "rose":
         return "#ffe4e6";
      case "violet":
         return "#ede9fe";
      default:
         return "#dbeafe";
   }
};

// type 400
export const returnHexCode = (theme: AppTheme) => {
   switch (theme) {
      case "blue":
         return "#60a5fa";
      case "emerald":
         return "#34d399";
      case "rose":
         return "#fb7185";
      case "violet":
         return "#a78bfa";
      default:
         return "#60a5fa";
   }
};

// type 600
export const returnDarkenHexCode = (theme: AppTheme) => {
   switch (theme) {
      case "blue":
         return "#2563eb";
      case "emerald":
         return "#059669";
      case "rose":
         return "#e11d48";
      case "violet":
         return "#7c3aed";
      default:
         return "#2563eb";
   }
};

// type 800
export const returnDarkestHexCode = (theme: AppTheme) => {
   switch (theme) {
      case "blue":
         return "#1e40af";
      case "emerald":
         return "#065f46";
      case "rose":
         return "#9f1239";
      case "violet":
         return "#5b21b6";
      default:
         return "#1e40af";
   }
};

export const returnAppTheme = (theme: APP_THEME) => {
   switch (theme) {
      case APP_THEME.LIGHT:
         return "#f8fafc";
      case APP_THEME.DARK:
         return "#1e293b";
      default:
         return "#f8fafc";
   }
};
export const returnAppThemeText = (theme: APP_THEME) => {
   switch (theme) {
      case APP_THEME.DARK:
         return "#f8fafc";
      case APP_THEME.LIGHT:
         return "#4b5563";
      default:
         return "#f8fafc";
   }
};

export const returnLightenAppTheme = (theme: APP_THEME) => {
   switch (theme) {
      case APP_THEME.LIGHT:
         return "#fff";
      case APP_THEME.DARK:
         return "#475569";
      default:
         return "#f8fafc";
   }
};

export const returnDarkenAppTheme = (theme: APP_THEME) => {
   switch (theme) {
      case APP_THEME.LIGHT:
         return "#e2e8f0";
      case APP_THEME.DARK:
         return "#1c1917";
      default:
         return "#e2e8f0";
   }
};
