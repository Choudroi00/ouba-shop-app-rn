import { User } from "../../models/User"
import { axiosClient } from "../api"


const getUser = async (email: string) : Promise<User>=> {
    const user = await axiosClient.get("/me")

    return user.data as User;
}

const register = async ({phone, password, name } : {phone : string, password?: string, name: string}) : Promise<User>=> {
    const r = await axiosClient.post("/register", {phone, password, name})

    console.log(`register response: `, r.data);
    

    if(r.status === 200){
        return r.data as User;
    }

    return r.data as User;
}


const login = async ({email, password} : {email? : string, password?: string}) : Promise<User> => {
    try {
        const r = await axiosClient.post("/login", {email, password})

        console.log(`login response: `, r.data);

        if (r.status === 200) {
            return r.data as User;
        }

        throw new Error("Invalid email or password");
    } catch (error) {
        console.error("Error during login:",JSON.stringify( {
            email,
            error:  error.message,
            stack: error instanceof Error ? error.stack : null,
        }));
        throw new Error("Login failed. Please check your credentials and try again.");
    }
    
}

export { getUser, register, login }  ;

