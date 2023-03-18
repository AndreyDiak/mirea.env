import React from "react";

import { Linking, Text, TouchableOpacity, View } from "react-native";

import { Card } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUserTheme } from "../../../features/userSlice";
import { useMaterialDocuments, useTheme } from "../../../hooks";
import { isEmpty } from "../../../utils";
import { Loader } from "../../common";

interface Props {
   materialId: string;
}

export const MaterialFiles: React.FC<Props> = React.memo(({ materialId }) => {
   const tw = useTailwind();
   const theme = useSelector(selectUserTheme);
   const { sources, loading } = useMaterialDocuments(materialId);

   const { THEME_MAIN } = useTheme();

   if (isEmpty(sources) && loading) {
      return <Loader text="Загрузка..." theme={theme} />;
   }

   if (!isEmpty(sources))
      return (
         <View style={tw("mb-2")}>
            <Card.Divider />
            <Text style={tw("mb-4 text-center")}>Прикрепленные файлы</Text>
            {sources.map((document) => (
               <TouchableOpacity key={document.id} onPress={async () => Linking.openURL(document.document)}>
                  <Text style={[tw("mb-2 font-semibold underline"), { color: THEME_MAIN }]}>
                     {document.title}
                  </Text>
               </TouchableOpacity>
            ))}
         </View>
      );
   return null;
});
