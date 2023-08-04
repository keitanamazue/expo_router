import 'react-native-url-polyfill/auto'

import { CommonActions, useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { supabase } from '@/app/lib/supabase'
import { Stack, useRouter } from 'expo-router'
import { useAuth } from '@/app/context/auth'

type Data = {
  email: string
  password: string
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()
  const router = useRouter();
  const { signIn } = useAuth();

  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<Data>({ mode: 'onChange' })


  const onSubmit = async (data: Data) => {
    const email = data.email
    const password = data.password
    try {
      setIsLoading(true)
      const { data: aaaa, error: authError } = await signIn(email,password)
      console.log({authError});
      
      if (aaaa) {
        router.replace("/foo");
      } else {
        console.log(error);
        // Alert.alert("Login Error", resp.error?.message);
      }
    } catch (error: any) {
      Alert.alert('予期せぬエラーが発生しました。')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: "Login", headerShown: true }} />
          <View style={styles.inputWrapper}>
            <Controller
              control={control}
              rules={{
                required: true,
                maxLength: 190,
              }}
              render={({ field: { onBlur, onChange, value } }) => {
                return (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder={'メールアドレスを入力してください'}
                    maxLength={190}
                  />
                )
              }}
              name="email"
              defaultValue=""
            />

            <Controller
              control={control}
              rules={{
                required: true,
                maxLength: 20,
              }}
              render={({ field: { onBlur, onChange, value } }) => {
                return (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder={'パスワードを入力してください'}
                    maxLength={20}
                    secureTextEntry={true}
                  />
                )
              }}
              name="password"
              defaultValue=""
            />
          </View>
          <View style={styles.loginWrapper}>
            <TouchableOpacity
              disabled={!isValid}
              style={[styles.login, { opacity: isValid ? 1 : 0.5 }]}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.button}>ログイン</Text>
            </TouchableOpacity>
          </View>
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 32,
    marginTop: 40,
  },
  inputWrapper: {
    marginTop: 32,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#B4BFC0',
    borderRadius: 10,
    padding: 10,
    marginTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  loginWrapper: {
    position: 'absolute',
    bottom: '13%',
    left: '0%',
    width: '100%',
  },
  login: {
    backgroundColor: '#B5BCFF',
    padding: 14,
    borderRadius: 50,
  },
})
