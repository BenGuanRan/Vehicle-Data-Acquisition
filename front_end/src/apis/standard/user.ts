export interface User {
    id: number;
    username: string;
    role: string;
    accountStatus: string;
    key: number;
}

export interface SubUser {
    id: number;
    username: string;
    disabled: boolean;
}