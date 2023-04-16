import React from "react";

import { View } from "react-native";

import { Input } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

import { useInstitute } from "../../../hooks/admin";
import { isEmpty } from "../../../utils";
import { Button } from "../../Button";

export const InstituteForm: React.FC = React.memo(() => {
   const tw = useTailwind();

   const { fullName, shortName, isError, isLoading, setFullName, setShortName, addInstitute } =
      useInstitute();

   return (
      <View>
         <Input
            label="Полное название института"
            value={fullName}
            onChangeText={setFullName}
            containerStyle={tw("pt-4")}
            errorMessage={isEmpty(fullName) && isError ? "Это поле обязательное!" : null}
         />
         <Input
            label="Короткое название института"
            value={shortName}
            onChangeText={setShortName}
            renderErrorMessage={isEmpty(shortName)}
            errorMessage={isEmpty(shortName) && isError ? "Это поле обязательное!" : null}
         />
         <Button title="Добавить" callback={addInstitute} disabled={isLoading} />
      </View>
   );
});
