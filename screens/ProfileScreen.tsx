import { View, Text } from "react-native";
import React from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import { Skeleton } from "@rneui/themed";
import { collection, getDocs, query, setDoc, where } from "firebase/firestore";
type Props = {};

const ProfileScreen = (props: Props) => {
  const tw = useTailwind();

  const [user, setUser] = useState<any>(null);

  onAuthStateChanged(auth, async (res) => {
    const email = res?.email;
    const q = query(collection(db, 'users/list/collection'), where('email', '==', email))
    const querySnap = await getDocs(q);
    const type = querySnap.docs[0].data().type;
    console.log(querySnap.docs[0].data())
    console.log(type)
    const newQ = query(collection(db, `users/${type}/collection`), where('email', '==', email))
    const newQSnap = await getDocs(newQ);
    setUser({
      ...newQSnap.docs[0].data()
    })
  });

  if (user === null) {
    return (
      <View style={tw("h-full w-full mt-10 px-4 flex flex-col justify-center")}>
        <View style={tw("flex flex-row justify-between mb-10")}>
          <Skeleton circle style={tw("w-20 h-20")} />
          <Skeleton style={tw("w-4/6 h-20 rounded-md")} />
        </View>
        <View style={tw('mb-10')}>
          <Skeleton style={tw("w-full h-40 rounded-lg")} />
        </View>
        <View>
          {Array(4)
            .fill(null)
            .map((_) => (
              <View style={tw("flex flex-row justify-between mb-10")}>
                <Skeleton style={tw("w-5/6 h-10 rounded-md")} />
                <Skeleton circle style={tw("w-10 h-10")} />
                {/* <Skeleton style={tw("w-5/6 h-10 rounded-md")} /> */}
              </View>
            ))}
        </View>
      </View>
    );
  }

  return (
    <View style={tw("p-6")}>
      <Text>Hello {user.name}</Text>
      <Text onPress={() => signOut(auth)}>Hello User</Text>
    </View>
  );
};

export default ProfileScreen;
