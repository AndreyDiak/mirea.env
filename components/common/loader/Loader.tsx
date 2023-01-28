import { Icon } from "@rneui/themed";
import React from "react";
import { returnHexCode } from "../../../utils/returnHexCodes";
import { CenteredText } from "../CenteredText";
export const Error: React.FC<{ text: string; theme: AppTheme }> = React.memo(
  ({ text, theme }) => (
    <CenteredText
      text={text}
      Icon={
        <Icon
          name="pending"
          type="material"
          color={returnHexCode(theme)}
          size={30}
        />
      }
    />
  )
);
