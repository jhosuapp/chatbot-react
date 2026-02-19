import axios from "axios";

const pythonApi = axios.create({
    baseURL: `${import.meta.env.VITE_APP_API_URL}`
});

export { pythonApi }