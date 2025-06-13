import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-blue-600 font-bold text-5xl">Welcome!</Text>
      <StatusBar style="auto"/>
      <Link href="/home" style={{ color: 'red'}}>Go to Profile</Link>
    </View>
  );
}
