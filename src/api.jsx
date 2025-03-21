import axios from "axios";

const API_URL = "http://127.0.0.1:8222"; // URL FastAPI-сервера

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // ✅ Обязательно, чтобы куки работали
});

// 📌 Интерцептор для автоматического обновления токена при 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.warn("⏳ Токен просрочен. Пытаемся обновить...");
            originalRequest._retry = true;
            try {
                await refreshToken();
                originalRequest.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error("❌ Ошибка при обновлении токена:", refreshError.response?.data || refreshError.message);
                throw refreshError;
            }
        }
        return Promise.reject(error);
    }
);

// 📌 Регистрация
export const register = async (email, password) => {
    return api.post("/register", {email, password}, {headers: {"Content-Type": "application/json"}});
};

// 📌 Логин
export const login = async (email, password) => {
    console.log("📨 Отправляем запрос на сервер:", {email, password});

    try {
        const response = await api.post("/login",
            {email, password},
            {headers: {"Content-Type": "application/json"}}
        );
        console.log("✅ Ответ сервера:", response.data);
        localStorage.setItem("access_token", response.data.access_token);
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка авторизации:", error.response?.data || error.message);
        throw error;
    }
};

// 📌 Обновление токена
export const refreshToken = async () => {
    try {
        const response = await api.post("/refresh");
        localStorage.setItem("access_token", response.data.access_token);
        console.log("🔄 Токен успешно обновлён.");
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка при обновлении токена:", error.response?.data || error.message);
        throw error;
    }
};

// 📌 Выход (Logout)
export const logout = async () => {
    try {
        await api.post("/logout");
        localStorage.removeItem("access_token");
        console.log("🚪 Выход выполнен успешно.");
    } catch (error) {
        console.error("❌ Ошибка при выходе:", error.response?.data || error.message);
    }
};

// 📌 Доступ к защищённому эндпоинту
export const getProtectedData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    return api.get("/protected", {
        headers: {Authorization: `Bearer ${token}`},
    });
};

// 📌 Проверка аутентификации
export const isAuthenticated = () => {
    const token = localStorage.getItem("access_token");
    return !!token;
};

// 📌 Получить список туров
export const getAllTours = async () => {
    return api.get("/tours");
};

// 📌 Создать новый тур
export const createTour = async (tourData) => {
    return api.post("/tours", tourData);
};