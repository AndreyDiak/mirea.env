import { View, Text } from 'react-native'
import React, {useLayoutEffect} from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTailwind } from 'tailwind-rn/dist'

type Props = {}

type DisciplineScreenRouteProp = RouteProp<RootStackParamList, 'Discipline'>

const DisciplineScreen = (props: Props) => {

  const tw = useTailwind();
  const navigation = useNavigation<DisciplineScreenNavigatorProp>();
  const {
    params: {
      discipline
    }
  } = useRoute<DisciplineScreenRouteProp>()
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: discipline.title
    })
  }, [discipline])

  console.log(discipline);

  return (
    <View style={tw('p-6')}>
      <Text style={tw('text-center')}>{discipline.title}</Text>
    </View>
  )
}

export default DisciplineScreen