import { User } from "../../models/User"
import { axiosClient } from "../api"


const getUser = async (email: string) : Promise<User>=> {
    const user = await axiosClient.get("/users/1")

    return user.data as User;
}

const register = async ({email, password} : {email : string, password?: string}) : Promise<User>=> {
    const r = await axiosClient.post("/users", {email, password})

    return r.data as User;
}

const login = async ({email, password} : {email? : string, password?: string}) : Promise<User>=> {
    const r = await axiosClient.post("/users/login", {email, password})
    
    return r.data as User;
}

export { getUser, register, login }  ;

