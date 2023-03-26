import React from "react";

import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Card } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

import { useMaterialDocuments, useTheme } from "../../../hooks";
import { isEmpty } from "../../../utils";

interface Props {
   materialId: string;
}

export const MaterialFiles: React.FC<Props> = React.memo(({ materialId }) => {
   const tw = useTailwind();

   const { sources, loading } = useMaterialDocuments(materialId);

   const { THEME_MAIN } = useTheme();

   // если выводить Loader то карточки будут очень большими при первичной загрузке
   if (isEmpty(sources) && loading) {
      return null;
   }

   if (!isEmpty(sources))
      return (
         <View style={tw("mb-2")}>
            <Card.Divider />
            <Text style={tw("mb-4 text-center")}>Прикрепленные файлы</Text>
            <ScrollView
               style={{
                  maxHeight: 120,
               }}
            >
               {sources.map((document) => (
                  <TouchableOpacity
                     key={document.id}
                     onPress={async () => Linking.openURL(document.document)}
                  >
                     <Text style={[tw("mb-2 font-semibold underline"), { color: THEME_MAIN }]}>
                        {document.title}
                     </Text>
                  </TouchableOpacity>
               ))}
            </ScrollView>
         </View>
      );
   return null;
});
