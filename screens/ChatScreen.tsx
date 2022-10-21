import { View, Text } from 'react-native'
import React, {useLayoutEffect} from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

type Props = {}
type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;
const ChatScreen = (props: Props) => {
  
  const {
    params: { discipline, group },
  } = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigatorProp>();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: group.groupTitle
    })
  }, [])

  return (
    <View>
      <Text>ChatScreen</Text>
    </View>
  )
}

export default ChatScreen