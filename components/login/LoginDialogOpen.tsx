import React from "react";

import { Text, View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

interface Props {
   isSelected: boolean;
   text: string;
   subText: string;
   openDialog: () => void;
}

export const LoginDialogOpen: React.FC<Props> = React.memo(({ isSelected, text, subText, openDialog }) => {
   const tw = useTailwind();
   return isSelected ? (
      <Text style={tw("text-blue-400 text-lg text-center")} onPress={openDialog}>
         {text}
      </Text>
   ) : (
      <View style={tw("flex flex-row flex-wrap justify-center")}>
         <Text>{subText} </Text>
         <Text style={tw("text-blue-400 underline")} onPress={openDialog}>
            Изменить
         </Text>
      </View>
   );
});
