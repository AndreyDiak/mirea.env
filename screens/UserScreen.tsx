import { View, Text } from 'react-native'
import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

type Props = {}

const UserScreen = (props: Props) => {
  return (
    <View>
      <Text onPress={() => signOut(auth)}>UserScreen</Text>
    </View>
  )
}

export default UserScreen