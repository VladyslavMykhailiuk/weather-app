const axiosInstance = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5/',
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json',
    },
    params: {
        'appid': '83731f87d9b6bc5582bf6f8ad128f58f',
        'units': 'metric'
    }
});

export default axiosInstance;