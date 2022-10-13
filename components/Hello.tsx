import { View, Text } from 'react-native'
import React from 'react'
import { useTailwind } from 'tailwind-rn/dist'

type Props = {}

const Hello = (props: Props) => {
  const tw = useTailwind();
  return (
    <View>
      <View style={tw('w-screen h-screen flex flex-row items-center justify-center')}>
        <Text style={tw('text-red-100')}>Hello world</Text>
      </View>
    </View>
  )
}

export default Hello