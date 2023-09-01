import React from "react";

import { Icon } from "@rneui/themed";

import { COLORS_400 } from "../../../typings";
import { CenteredText, CenteredTextFullScreen } from "../CenteredText";

export const FullScreenError: React.FC<{ text: string; theme: COLORS_400 }> = React.memo(
   ({ text, theme }) => (
      <CenteredTextFullScreen
         text={text}
         Icon={<Icon name="sentiment-very-dissatisfied" type="material" color={theme} size={30} />}
      />
   ),
);

export const Error: React.FC<{ text: string; theme: COLORS_400 }> = React.memo(({ text, theme }) => {
   return (
      <CenteredText
         text={text}
         Icon={<Icon name="sentiment-very-dissatisfied" type="material" color={theme} size={30} />}
      />
   );
});
