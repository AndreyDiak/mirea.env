import { View, Text } from 'react-native'
import React from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { useSelector } from 'react-redux'
import { getNotifications } from '../features/userSlice'

type Props = {}

const NotificationsScreen = (props: Props) => {
  const tw = useTailwind();
  const notifications = useSelector(getNotifications);

  return (
    <View style={tw('p-6')}>
      {notifications.map(notification => (
        <Text>Helo</Text>
      ))}
    </View>
  )
}

export default NotificationsScreen