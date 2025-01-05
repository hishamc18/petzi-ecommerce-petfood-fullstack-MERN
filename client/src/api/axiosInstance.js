import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip refresh logic if the flag is set
        if (originalRequest.skipAuthRefresh) {
            return Promise.reject(error);
        }

        // Handle 401 errors for expired tokens
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axiosInstance.post("/refresh-token");

                // Retry the original request after refreshing the token
                isRefreshing = false;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                processQueue(refreshError, null);

                // Redirect to login if refresh fails
                if (refreshError.response?.status === 401) {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
