import React from "react";

import { Text, View } from "react-native";

import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUserType } from "../../../features/slices/userSlice";
import { USER_TYPE } from "../../../typings";
import { Label } from "../../common/Label";

interface Props {
   teachersNames: string[] | null;
   groupNames: string[] | null;
   cabinet: string;
}

export const TimetableLessonRowAddData: React.FC<Props> = React.memo(
   ({ teachersNames, groupNames, cabinet }) => {
      const tw = useTailwind();
      const userType = useSelector(selectUserType);

      const renderText = (text: string, isLast: boolean) => {
         return (
            <Text style={[tw("text-gray-400")]} key={text}>
               {text}
               {!isLast ? ", " : null}
            </Text>
         );
      };

      return (
         <View style={tw("flex-row justify-between items-center mt-1")}>
            <View style={tw("flex flex-row flex-1 flex-wrap")}>
               {userType === USER_TYPE.STUDENT
                  ? teachersNames.map((teacherName, index) =>
                       renderText(teacherName, index === teachersNames.length - 1),
                    )
                  : groupNames.map((groupName, index) =>
                       renderText(groupName, index === groupNames.length - 1),
                    )}
            </View>

            {cabinet ? <Label type="secondary" content={cabinet} /> : null}
         </View>
      );
   },
);
