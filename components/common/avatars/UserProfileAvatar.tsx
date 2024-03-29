import React from "react";

import { Image, StyleSheet, Text, View } from "react-native";

import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUserTheme } from "../../../features/slices/userSlice";
import { returnDarkenHexCode } from "../../../utils";

type Props = {
   title?: string;
   source?: string;
};

export const UserProfileAvatar: React.FC<Props> = React.memo(({ title, source }) => {
   const tw = useTailwind();

   const theme = useSelector(selectUserTheme);

   const styles = StyleSheet.create({
      image: {
         width: 90,
         height: 90,
         display: "flex",
         justifyContent: "center",
         alignItems: "center",
         borderRadius: 50,
         backgroundColor: "#fff",
         transform: [{ translateY: 45 }],
      },
   });

   if (!source) {
      return (
         <View style={styles.image}>
            <Text
               style={[
                  tw("font-bold text-2xl"),
                  {
                     color: returnDarkenHexCode(theme),
                  },
               ]}
            >
               {title}
            </Text>
         </View>
      );
   }

   return <Image style={styles.image} source={{ uri: source }} />;
});
