import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAppStore } from "../../store/useAppStore";
import { api } from "../../lib/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("staff@demo.com");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAppStore((s) => s.setAuth);
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      setAuth(res.data.token, res.data.user);
      router.replace("/(tabs)/alerts");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-gray-950 justify-center px-6">
      <Text className="text-white text-3xl font-bold mb-2">CareAlert</Text>
      <Text className="text-gray-400 mb-10">Staff Login</Text>
      <TextInput
        className="bg-gray-800 text-white rounded-xl px-4 py-4 mb-4"
        placeholder="Email"
        placeholderTextColor="#6b7280"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        className="bg-gray-800 text-white rounded-xl px-4 py-4 mb-6"
        placeholder="password"
        placeholderTextColor="#6b7280"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text className="text-red-400 mb-4">{error}</Text> : null}

      <TouchableOpacity
        className="bg-blue-600 rounded-xl py-4 items-center"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-base">Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
