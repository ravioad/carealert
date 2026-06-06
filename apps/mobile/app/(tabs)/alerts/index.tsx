import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAlerts, Alert } from "../../../hooks/useAlerts";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  TouchableOpacity,
  View,
  Text,
  FlatList,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";

dayjs.extend(relativeTime);

const SEVERITY_COLORS = {
  critical: "bg-red-600",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
};

function AlertCard({ alert, onPress }: { alert: Alert; onPress: () => void }) {
  return (
    <TouchableOpacity
      className="bg-gray-800 rounded-xl p-4 mb-3 mx-4"
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View
          className={`px-2 py-1 rounded-md ${SEVERITY_COLORS[alert.severity]}`}
        >
          <Text className="text-white text-xs font-bold uppercase">
            {alert.severity}
          </Text>
        </View>
        <Text className="text-gray-400 text-xs">
          {dayjs(alert.createdAt).fromNow()}
        </Text>
      </View>
      <Text className="text-white font-semibold text-base capitalize">
        {alert.eventType.replace("_", " ")}
      </Text>
      <Text className="text-gray-400 text-sm mt-1">
        Room {alert.roomNumber} · {alert.patientName}
      </Text>
    </TouchableOpacity>
  );
}

export default function AlertsScreen() {
  const { data: alerts, isLoading, refetch } = useAlerts();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <View className="flex-1 bg-gray-950">
        <Text className="text-white text-2xl font-bold px-4 pt-6 pb-4">
          Active Alerts {alerts?.length ? `(${alerts.length})` : ""}
        </Text>
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AlertCard
              alert={item}
              onPress={() => router.push(`/alerts/${item.id}`)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <Text className="text-gray-500 text-center mt-20">
              No active alerts
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}
