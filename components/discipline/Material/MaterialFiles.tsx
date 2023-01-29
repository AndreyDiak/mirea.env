import { Card } from "@rneui/themed";
import React from "react";

import { View, Text, TouchableOpacity, Linking } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { returnHexCode } from "../../../utils/returnHexCodes";

interface Props {
  documents: Source[];
  userTheme: AppTheme;
}

export const MaterialFiles: React.FC<Props> = React.memo(({ documents, userTheme }) => {
  const tw = useTailwind();
  if (documents.length > 0)
    return (
      <View style={tw("mb-2")}>
        <Card.Divider />
        <Text style={tw("mb-4 text-center")}>Прикрепленные файлы</Text>
        {documents.map((document) => (
          <TouchableOpacity
            key={document.id}
            onPress={async () => await Linking.openURL(document.document)}
          >
            <Text style={[tw("mb-2 font-semibold underline"), { color: returnHexCode(userTheme) }]}>
              {document.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
});
