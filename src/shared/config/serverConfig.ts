/**
 * Cấu hình kết nối đến backend server.
 *
 * Cách sử dụng:
 * 1. Tìm IP máy Mac: ifconfig | grep "inet " | grep -v 127.0.0.1
 * 2. Điền IP vào file .env: EXPO_PUBLIC_SERVER_IP=192.168.x.x
 * 3. Restart Expo sau khi thay đổi .env
 */

const SERVER_IP = process.env.EXPO_PUBLIC_SERVER_IP ?? 'localhost';
const SERVER_PORT = process.env.EXPO_PUBLIC_SERVER_PORT ?? '3001';

/**
 * Trả về base URL của backend server.
 * - Thiết bị thật qua Expo Go: dùng IP máy Mac từ biến môi trường
 * - Simulator/Emulator: dùng localhost
 */
export function getServerBaseUrl(): string {
    return `http://${SERVER_IP}:${SERVER_PORT}`;
}

export const SERVER_BASE_URL = getServerBaseUrl();
