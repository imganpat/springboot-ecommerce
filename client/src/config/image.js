import { envConfig } from "@/config/env";

const backendBaseUrl = envConfig.apiBaseUrl.replace(/\/api\/?$/, "");

export function getImageUrl(filename) {
    return filename
        ? `${backendBaseUrl}/uploads/images/${filename}`
        : "";
}