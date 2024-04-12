import {SubUser} from "@/apis/standard/user.ts";

export const OPEN_USER = 'OPEN_USER';
export const CLOSE_USER = 'CLOSE_USER';
export const DELETE_USER = 'DELETE_USER';
export const ADD_USER = 'ADD_USER';

export const userReducer = (state: SubUser[], action: { type: string, payload: SubUser }) => {
    switch (action.type) {
        case OPEN_USER:
            return state.map(user =>
                user.id === action.payload.id ? {...user, disabled: false} : user
            );
        case CLOSE_USER:
            return state.map(user =>
                user.id === action.payload.id ? {...user, disabled: true} : user
            );
        case DELETE_USER:
            return state.filter(user => user.id !== action.payload.id);
        case ADD_USER:
            return [...state, action.payload];
        default:
            return state;
    }
};
