let demoMode = false;

function envTruthy(value: string | undefined) {
  if (!value) return false;
  return value === "1" || value.toLowerCase() === "true" || value.toLowerCase() === "yes";
}

export function setDemoMode(next: boolean) {
  demoMode = next;
}

export function getApiBaseUrl() {
  return process.env.EXPO_PUBLIC_API_BASE_URL;
}

export function isDemoMode() {
  if (demoMode) return true;
  if (envTruthy(process.env.EXPO_PUBLIC_DEMO_MODE)) return true;
  if (!getApiBaseUrl()) return true;
  return false;
}

