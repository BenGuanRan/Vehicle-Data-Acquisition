const getToken = (): string | null => {
    return localStorage.getItem('token');
};

const getTokenLastDate = (): string | null => {
    return localStorage.getItem('lastTokenDate');
}

const setToken = (token: string): void => {
    localStorage.setItem('token', token);
    localStorage.setItem('lastTokenDate', Date.now().toString());
};

const removeToken = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastTokenDate');
};


const tokenUtils = {
    getToken,
    setToken,
    removeToken,
    getTokenLastDate,
};

export default tokenUtils;