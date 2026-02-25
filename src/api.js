import axios from "axios";

const API = axios.create({
    baseURL: "https://servicepratik.pythonanywhere.com/api/", // 🔥 આ હોવું જોઈએ
});

let isRefreshing = false;
let refreshSubscribers = [];

// 🔁 Subscribe requests while refreshing
const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

// 🔁 Notify all waiting requests
const onRefreshed = (newToken) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
};

// =====================
// REQUEST INTERCEPTOR
// =====================
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


// =====================
// RESPONSE INTERCEPTOR
// =====================
// =====================
// RESPONSE INTERCEPTOR
// =====================
API.interceptors.response.use(
    (response) => response,
    async(error) => {

        const originalRequest = error.config;

        // 🔥 આ લાઈન બદલો (optional chaining દૂર કરો)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {

            const refreshToken = localStorage.getItem("refresh");

            if (!refreshToken) {
                localStorage.clear();
                window.location.href = "/";
                return Promise.reject(error);
            }

            // ... બાકીનો કોડ એ જ રાખો

            if (isRefreshing) {
                // Wait for refresh to complete
                return new Promise((resolve) => {
                    subscribeTokenRefresh((newToken) => {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        resolve(API(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await axios.post(
                    "https://servicepratik.pythonanywhere.com/api/token/refresh/", // 🔥 PythonAnywhere URL
                    { refresh: refreshToken }
                );

                const newAccess = res.data.access;

                localStorage.setItem("access", newAccess);

                API.defaults.headers.common.Authorization = `Bearer ${newAccess}`;

                onRefreshed(newAccess);

                return API(originalRequest);

            } catch (refreshError) {

                localStorage.clear();
                window.location.href = "/";
                return Promise.reject(refreshError);

            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default API;