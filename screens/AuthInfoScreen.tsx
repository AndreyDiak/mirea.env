import { View, Text } from "react-native";
import React, {useState} from "react";
import { useTailwind } from "tailwind-rn/dist";
import LoginForm from "../components/LoginForm";
import { Input } from "@rneui/themed";
import { CheckBox } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
type Props = {};

const AuthInfoScreen = (props: Props) => {
  const tw = useTailwind();

  const navigation = useNavigation<AuthInfoScreenNavigatorProp>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [secondPassword, setSecondPassword] = useState<string>("");
  // const [isStudent, setIsStudent] = useState<boolean>(true);

  const register = () => {
    if(password === secondPassword) {
      navigation.navigate('AuthBio', {
        email, password
      })
    }
  }

  return (
    <View
      style={tw(
        "w-full h-full bg-slate-100 flex flex-row items-center justify-center"
      )}
    >
      <LoginForm handleSubmit={register} step='info'>
        <View>
          <Input
            placeholder="Почта..."
            value={email}
            onChangeText={setEmail}
            containerStyle={tw("")}
          />
          <Input
            placeholder="Пароль..."
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            containerStyle={tw("")}
          />
          <Input
            placeholder="Повторите пароль..."
            value={secondPassword}
            onChangeText={setSecondPassword}
            secureTextEntry
            containerStyle={tw("")}
          />
        </View>
      </LoginForm>
    </View>
  );
};

export default AuthInfoScreen;
