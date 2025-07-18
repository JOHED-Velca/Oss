import React, { useState } from 'react'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '@/constants'
import FormField from '../../components/FormField'

import { Link, router } from 'expo-router'
import CustomButton from '../../components/CustomButton'

import { useGlobalContext } from '@/context/GlobalProvider'
import { getCurrentUser, signIn } from '../../lib/appwrite'

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

const submit = async () => {
  if(!form.email || !form.password) {
    Alert.alert('Error', 'Please fill all fields')
  }

  setIsSubmitting(true);

  try {
    await signIn( form.email, form.password);
    const result = await getCurrentUser(); 
    setUser(result); 
    setIsLoggedIn(true); 
    
    Alert.alert('Success', 'You have successfully signed in!');
    router.replace('/home');
  } catch (error:any) {
    Alert.alert('Error', error.message);
  } finally {
    setIsSubmitting(false);
  }
}
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
          <Image
            source={images.logo}
            resizeMode='contain'
            className='w-[115px] h-[35px]'
          />

          <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>
            Log in to Aora
          </Text>

          <FormField
            title='Email'
            value={form.email}
            handleChangeText={(e: any) => setForm({ ...form, email: e })}
            otherStyles='mt-7'
            keyboardType='email-address'
          />

          <FormField
            title='Password'
            value={form.password}
            handleChangeText={(e: any) => setForm({ ...form, password: e })}
            otherStyles='mt-7'
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={isSubmitting}
          />

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>
              Don't have an account?
            </Text>
            <Link href="/sign-up" className='text-lg font-psemibold text-secondary'>
              <Text>Sign Up</Text>
            </Link>
          </View>
          <View className='justify-center items-center'>
            <Link href="/home" className='text-lg font-psemibold text-secondary'>
              <Text>Go to Home</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn