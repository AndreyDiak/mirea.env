import React from "react";

import { Icon } from "@rneui/themed";

import { AppTheme } from "../../../typings";
import { returnHexCode } from "../../../utils/returnHexCodes";
import { CenteredText } from "../CenteredText";

export const Error: React.FC<{ text: string; theme?: AppTheme }> = React.memo(({ text, theme }) => (
   <CenteredText
      text={text}
      Icon={
         <Icon
            name="sentiment-very-dissatisfied"
            type="material"
            color={returnHexCode(theme || "blue")}
            size={30}
         />
      }
   />
));
