const getToken = (): string | null => {
    return localStorage.getItem('token');
};

const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

const removeToken = (): void => {
    localStorage.removeItem('token');
};

const tokenUtils = {
    getToken,
    setToken,
    removeToken
};

export default tokenUtils;