import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import CustomButton from "@/components/CustomButton";
import { images } from "../constants";



export default function App() {

  // const {isLoading, isLoggedIn} = useGlobalContext();

  // console.log('context:', { isLoading, isLoggedIn });
  

  // if(!isLoading && isLoggedIn) return <Redirect href="/home" />
  
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%'}}>
         <View className="w-full justify-center items-center h-full px-4">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[130px] h-[84px]"
          />

          <Image
            source={images.cards}
            className="max-w-[880px] w-full h-[300px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Track your fighting journey with {' '}
              <Text className="text-secondary-200">Oss</Text>
            </Text>
            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-3 left-1/2 -translate-x-1/3"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            From white belt to black belt: Track, improve, and Oss.
          </Text>

          <CustomButton
            title="Continue with Passkey"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}