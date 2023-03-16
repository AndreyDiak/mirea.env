import React from "react";

import { Avatar } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

type Props = {
   title?: string;
   source?: string;
   size?: ("small" | "medium" | "large" | "xlarge") | number;
};

export const UserChatAvatar: React.FC<Props> = React.memo(({ title, source, size }) => {
   const tw = useTailwind();

   return source ? (
      <Avatar
         size={size || "medium"}
         source={{ uri: source }}
         rounded
         avatarStyle={tw("")}
         overlayContainerStyle={tw("bg-blue-400")}
         titleStyle={tw("text-white")}
         containerStyle={tw("mr-4 mb-1")}
      />
   ) : (
      <Avatar
         title={title}
         size={size || "medium"}
         rounded
         avatarStyle={tw("")}
         overlayContainerStyle={tw("bg-blue-400")}
         titleStyle={tw("text-white")}
         containerStyle={tw("mr-4 mb-1")}
      />
   );
});
