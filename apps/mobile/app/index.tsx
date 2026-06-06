import { Redirect } from "expo-router";
import { useAppStore } from "../store/useAppStore";

export default function Index() {
  const token = useAppStore((s) => s.token);
  return token ? <Redirect href="/alerts" /> : <Redirect href="/login" />;
}
