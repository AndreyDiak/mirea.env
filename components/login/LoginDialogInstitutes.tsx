import { CheckBox } from "@rneui/themed";
import React from "react";
import { FlatList, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";

interface Props {
  isStudent: boolean;
  institutes: Institute[];
  myInstitutes: Institute[];
  setMyInstitutes: (institutes: Institute[]) => void;
}

export const LoginDialogInstitutes: React.FC<Props> = React.memo(
  ({ isStudent, institutes, setMyInstitutes, myInstitutes }) => {
    const toggleMyInstitututes = (institute: Institute, isSelected: boolean) => {
      if (isStudent) {
        setMyInstitutes([institute]);
      } else {
        let myInstitutesCopy = [...myInstitutes];
        if (isSelected) {
          myInstitutesCopy = myInstitutesCopy.filter((inst) => inst.id !== institute.id);
        } else {
          myInstitutesCopy.push(institute);
        }
        setMyInstitutes(myInstitutesCopy);
      }
    };

    const tw = useTailwind();
    return (
      <View>
        <FlatList
          data={institutes}
          scrollEnabled
          style={tw("max-h-[350px]")}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isSelected = myInstitutes.some((institute) => institute.id === item.id);
            return (
              <CheckBox
                key={index}
                title={item.name}
                checked={isSelected}
                onPress={() => toggleMyInstitututes(item, isSelected)}
                containerStyle={tw("text-center")}
              />
            );
          }}
        />
      </View>
    );
  }
);
