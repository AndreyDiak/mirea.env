import React from "react";

import { Icon } from "@rneui/themed";

import { APP_THEME, USER_THEME } from "../../../typings";
import { returnHexCode } from "../../../utils/returnHexCodes";
import { CenteredText } from "../CenteredText";

export const Loader: React.FC<{ text: string; theme?: USER_THEME }> = React.memo(({ text, theme }) => (
   <CenteredText
      text={text}
      Icon={<Icon name="pending" type="material" color={returnHexCode(theme)} size={30} />}
   />
));
