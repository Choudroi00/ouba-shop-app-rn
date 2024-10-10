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

const login = async ({email, password} : {email? : string, password?: string}) : Promise<User> => {
    const r = await axiosClient.post("/login", {email, password}).catch((e)=> e)

    if(r.status === 200){
        return r.data as User;
    }

    console.log(r);
    

    throw new Error("Invalid email or password");
    
}

export { getUser, register, login }  ;

