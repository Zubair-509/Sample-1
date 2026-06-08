export interface AppConfig {
  aiEnabled: boolean;
}

export async function fetchConfig(): Promise<AppConfig> {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) return { aiEnabled: false };
    return await res.json();
  } catch {
    return { aiEnabled: false };
  }
}
