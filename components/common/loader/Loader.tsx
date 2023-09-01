import React from "react";

import { Icon } from "@rneui/themed";

import { COLORS_400 } from "../../../typings";
import { CenteredText, CenteredTextFullScreen } from "../CenteredText";

export const FullScreenLoader: React.FC<{ text: string; theme?: COLORS_400 }> = React.memo(
   ({ text, theme }) => (
      <CenteredTextFullScreen
         text={text}
         Icon={<Icon name="pending" type="material" color={theme} size={30} />}
      />
   ),
);

export const Loader: React.FC<{ text: string; theme?: COLORS_400 }> = React.memo(({ text, theme }) => (
   <CenteredText text={text} Icon={<Icon name="pending" type="material" color={theme} size={30} />} />
));
