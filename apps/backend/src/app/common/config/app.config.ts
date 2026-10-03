import { registerAs } from "@nestjs/config";

export interface AppConfig {
  port: number;
  corsOrigins: string[];
}

export const appConfig = registerAs("app", (): AppConfig => ({
  port: Number(process.env.PORT ?? 8080),
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
}));
