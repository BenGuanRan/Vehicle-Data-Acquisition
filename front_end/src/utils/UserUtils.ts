interface UserInfo {
    username: string;
    isRootUser: boolean;
    userId: number;
    token: string;
    disabled: boolean;
    lastLoginTime: string;
}


const saveUserInfo = (userInfo: UserInfo) => {
    console.log("在localStorage中保存用户信息", userInfo)
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

const getUserInfo = (): UserInfo => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
}

const removeUserInfo = () => {
    localStorage.removeItem('userInfo');
}

const isLogin = () => {
    return !!getUserInfo();
}

const isRootUser = () => {
    const userInfo = getUserInfo();
    return userInfo ? userInfo.isRootUser : false;
}

const isDisabled = () => {
    const userInfo = getUserInfo();
    return userInfo ? userInfo.disabled : false;
}

const getUserId = () => {
    const userInfo = getUserInfo();
    return userInfo ? userInfo.userId : null;
}

const getToken = () => {
    const userInfo = getUserInfo();
    return userInfo ? userInfo.token : null;
}

const updateLoginTime = () => {
    const userInfo = getUserInfo();
    userInfo.lastLoginTime = new Date().toLocaleString();
    saveUserInfo(userInfo);
}

const getUserLastLoginTime = () => {
    const userInfo = getUserInfo();
    return userInfo ? userInfo.lastLoginTime : null;
}

const userUtils = {
    saveUserInfo,
    getUserInfo,
    removeUserInfo,
    isLogin,
    isRootUser,
    isDisabled,
    getUserId,
    getToken,
    updateLoginTime,
    getUserLastLoginTime
}

export default userUtils;