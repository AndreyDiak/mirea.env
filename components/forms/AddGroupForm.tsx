import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card, Input } from '@rneui/themed'
import { useTailwind } from 'tailwind-rn/dist'
import { collection, getDocs, query } from 'firebase/firestore'
import { db } from '../../firebase'

type Props = {}

const AddGroupForm = (props: Props) => {
  
  const tw = useTailwind();

  const [groupName, setGroupName] = useState('')
  const [institutes, setInstitutes] = useState<any>([]);

  useEffect(() => {
    const getInstitutes = async () => {
      const q = query(collection(db, 'institute'));
      const snap = await getDocs(q);
      const institutes = snap.docs.map(insitute => ({
        ...insitute.data(),
        instituteId: insitute.id
      }))
      setInstitutes(institutes);
    }
    getInstitutes();
  }, [])

  const addGroup = async () => {
    if(groupName === '') {
      return;
    }


  }

  console.log(institutes);

  return (
    <View>
      <Card>
        <Card.Title>
          Добавить группу
        </Card.Title>
        <Input
          label="Название группы"
          value={groupName}
          onChangeText={setGroupName}
        />

        <Card.Divider />
        <TouchableOpacity style={tw('flex flex-row justify-center')} onPress={addGroup}>
          <Text style={tw('bg-blue-400 px-3 py-2 text-white rounded-md font-semibold text-lg')}>
            Добавить
          </Text>
        </TouchableOpacity>
      </Card>
    </View>
  )
}

export default AddGroupForm