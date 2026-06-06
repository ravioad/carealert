import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAcknowledgeAlert, Alert } from "../../hooks/useAlerts";
import { api } from "../../lib/api";
import dayjs from "dayjs";

export default function AlertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { mutate: acknowledge, isPending } = useAcknowledgeAlert();

  const { data: alert, isLoading } = useQuery<Alert>({
    queryKey: ["alert", id],
    queryFn: async () => {
      const res = await api.get(`/alerts/${id}`);
      return res.data;
    },
  });

  if (isLoading || !alert) {
    return (
      <SafeAreaView className="flex-1 bg-gray-950 justify-center items-center">
        <Text className="text-gray-400">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-950 px-4 pt-4">
      <TouchableOpacity onPress={() => router.back()} className="mb-6">
        <Text className="text-blue-400 text-base">← Back</Text>
      </TouchableOpacity>
      <Text className="text-white text-2xl font-bold capitalize mb-1">
        {alert.eventType.replace("_", " ")}
      </Text>
      <Text className="text-gray-400 mb-6">
        {dayjs(alert.createdAt).format("DD MMM YYYY, HH:mm")}
      </Text>

      <View className="bg-gray-800 rounded-xl p-4 mb-4">
        <Row label="Room" value={alert.roomNumber} />
        <Row label="Patient" value={alert.patientName} />
        <Row label="Severity" value={alert.severity.toUpperCase()} />
        <Row label="Status" value={alert.status} />
      </View>

      {alert.status === "active" && (
        <TouchableOpacity
          className="bg-blue-600 rounded-xl py-4 items-center mb-3"
          onPress={() =>
            acknowledge(
              { id: alert.id, status: "acknowledged" },
              { onSuccess: () => router.back() },
            )
          }
          disabled={isPending}
        >
          <Text className="text-white font-semibold">Acknowledge</Text>
        </TouchableOpacity>
      )}

      {alert.status !== "resolved" && (
        <TouchableOpacity
          className="bg-green-700 rounded-xl py-4 items-center"
          onPress={() =>
            acknowledge(
              { id: alert.id, status: "resolved" },
              { onSuccess: () => router.back() },
            )
          }
          disabled={isPending}
        >
          <Text className="text-white font-semibold">Mark Resolved</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2 border-b border-gray-700">
      <Text className="text-gray-400">{label}</Text>
      <Text className="text-white font-medium">{value}</Text>
    </View>
  );
}
