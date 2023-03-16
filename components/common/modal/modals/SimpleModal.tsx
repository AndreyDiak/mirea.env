import React from "react";

import { Text, View } from "react-native";

import { Dialog } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

import { useGlobalModalContext } from "../GlobalModal";

export function SimpleModal() {
   const { closeModal, store } = useGlobalModalContext();

   const tw = useTailwind();

   const {
      modalProps: { title, children },
   } = store;

   return (
      <Dialog isVisible onPressOut={closeModal} overlayStyle={tw("")}>
         <View style={tw("w-full  flex flex-col items-center")}>
            <Text style={tw("font-bold text-xl mb-2")}>{title}</Text>
            <Text>{children()}</Text>
         </View>
      </Dialog>
   );
}
