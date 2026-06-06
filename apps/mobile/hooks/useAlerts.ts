import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface Alert {
  id: string;
  roomNumber: string;
  patientName: string;
  eventType: string;
  severity: "critical" | "high" | "medium";
  status: "active" | "acknowledged" | "resolved";
  createdAt: string;
}

export function useAlerts() {
  return useQuery<Alert[]>({
    queryKey: ["alerts"],
    queryFn: async () => {
      const res = await api.get("/alerts?status=active");
      return res.data;
    },
    refetchInterval: 5000, // poll every 5 seconds
  });
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: String;
      status: "acknowledged" | "resolved";
    }) => {
      const res = await api.patch(`/alerts/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}
