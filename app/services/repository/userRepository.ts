import { User } from "../../models/User"
import { axiosClient } from "../api"


const getUser = async (email: string) : Promise<User>=> {
    const user = await axiosClient.get("/me")

    return user.data as User;
}

const register = async ({email, password} : {email : string, password?: string}) : Promise<User>=> {
    const r = await axiosClient.post("/register", {email, password})

    if(r.status === 200){
        return r.data as User;
    }

    return r.data as User;
}


const login = async ({email, password} : {email? : string, password?: string}) : Promise<User> => {
    const r = await axiosClient.post("/login", {email, password}).catch((e)=> e)

    if(r.status === 200){
        return r.data as User;
    }

    
    

    throw new Error("Invalid email or password");
    
}

export { getUser, register, login }  ;

