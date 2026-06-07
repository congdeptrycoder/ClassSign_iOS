import { SERVER_BASE_URL } from '../../shared/config/serverConfig';

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

/**
 * Wrapper fetch hướng đến backend server.
 * Tuân thủ Clean Architecture: chỉ chịu trách nhiệm HTTP transport,
 * không chứa business logic.
 *
 * @param endpoint - Đường dẫn API, ví dụ: '/auth/login'
 * @param options  - RequestInit options của fetch
 */
async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${SERVER_BASE_URL}/api${endpoint}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers ?? {}),
            },
            ...options,
        });

        const json = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: json.message ?? `HTTP ${response.status}`,
            };
        }

        return { success: true, data: json as T };
    } catch (err) {
        const message =
            err instanceof Error ? err.message : 'Lỗi kết nối đến server.';
        console.error(`[ApiClient] Lỗi gọi ${url}:`, message);
        return { success: false, message };
    }
}

export const apiClient = {
    get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        }),
    put: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        }),
    delete: <T>(endpoint: string) =>
        request<T>(endpoint, {
            method: 'DELETE',
        }),
};
