import { Card } from "@rneui/themed";
import React from "react";

import { Linking, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import { selectUserTheme } from "../../../features/userSlice";
import { useMaterialDocuments } from "../../../hooks";
import { returnHexCode } from "../../../utils/returnHexCodes";
import { Loader } from "../../common";

interface Props {
  materialId: string;
}

export const MaterialFiles: React.FC<Props> = React.memo(({ materialId }) => {
  const tw = useTailwind();
  const theme = useSelector(selectUserTheme);
  const { sources, loading, error } = useMaterialDocuments(materialId);
  if (sources.length === 0 && loading) {
    return <Loader text={"Загрузка..."} theme={theme} />;
  }
  if (sources.length > 0)
    return (
      <View style={tw("mb-2")}>
        <Card.Divider />
        <Text style={tw("mb-4 text-center")}>Прикрепленные файлы</Text>
        {sources.map((document) => (
          <TouchableOpacity
            key={document.id}
            onPress={async () => await Linking.openURL(document.document)}
          >
            <Text style={[tw("mb-2 font-semibold underline"), { color: returnHexCode(theme) }]}>
              {document.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
});
