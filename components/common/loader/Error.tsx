import React from "react";

import { Icon } from "@rneui/themed";

import { USER_THEME } from "../../../typings";
import { returnHexCode } from "../../../utils/returnHexCodes";
import { CenteredText } from "../CenteredText";

export const Error: React.FC<{ text: string; theme?: USER_THEME }> = React.memo(({ text, theme }) => (
   <CenteredText
      text={text}
      Icon={
         <Icon name="sentiment-very-dissatisfied" type="material" color={returnHexCode(theme)} size={30} />
      }
   />
));
