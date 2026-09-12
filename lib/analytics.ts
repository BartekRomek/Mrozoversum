import { sendGAEvent } from "@next/third-parties/google";

type AnalyticsValue = string | number | boolean;

export function trackEvent(
  name: string,
  params: Record<string, AnalyticsValue> = {}
) {
  sendGAEvent("event", name, params);
}
