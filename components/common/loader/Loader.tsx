import { Icon } from "@rneui/themed";
import React from "react";
import { returnHexCode } from "../../../utils/returnHexCodes";
import { CenteredText } from "../CenteredText";

export const Loader: React.FC<{ text: string; theme?: AppTheme }> = React.memo(
  ({ text, theme }) => (
    <CenteredText
      text={text}
      Icon={
        <Icon name="pending" type="material" color={returnHexCode(theme || "blue")} size={30} />
      }
    />
  )
);
