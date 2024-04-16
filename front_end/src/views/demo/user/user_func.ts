import {useReducer} from "react";


export const useUserFunc = (initData: string[]) => {
    const [user, setUser] = useReducer(userReducer, initData)

    const addUser = () => {
        console.log(user)
        setUser({type: "1", payload: "1"})
    }

    return {
        user,
        addUser
    }
}


const userReducer = (statue: string[], action: { type: string, payload: string }) => {
    switch (action.type) {
        case "1" : {
            return [...statue, action.payload]
        }
        default:
            return statue

    }
}