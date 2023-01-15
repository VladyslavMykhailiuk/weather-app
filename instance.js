const axiosInstance = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5/',
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;