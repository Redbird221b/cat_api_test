import axios from "axios";

const API_URL = "http://127.0.0.1:8222"; // URL FastAPI-сервера

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // ✅ Обязательно, чтобы куки работали
});

// Регистрация
export const register = async (email, password) => {
    return api.post("/register", { email, password }, { headers: { "Content-Type": "application/json" } });
};

// Логин
export const login = async (email, password) => {
    console.log("📨 Отправляем запрос на сервер:", { email, password });

    try {
        const response = await api.post("/login",
            { email, password },
            { headers: { "Content-Type": "application/json" } }
        );
        console.log("✅ Ответ сервера:", response.data);
        localStorage.setItem("access_token", response.data.access_token);
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка авторизации:", error.response?.data || error.message);
    }
};


// Обновление токена
export const refreshToken = async () => {
    try {
        const response = await api.post("/refresh", {}); // ⬅️ без лишних заголовков
        localStorage.setItem("access_token", response.data.access_token);
        return response.data;
    } catch (error) {
        console.error("Ошибка при обновлении токена:", error.response?.data || error.message);
        throw error; // Пробрасываем ошибку, чтобы фронт мог обработать её
    }
};

// Доступ к защищённому эндпоинту
export const getProtectedData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    return api.get("/protected", {
        headers: { Authorization: `Bearer ${token}` },
    });
};
