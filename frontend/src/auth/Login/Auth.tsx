import { useState } from "react"
import { SignUp } from "./SignUpForm";
import { LoginForm } from "./LoginForm";
import { Button } from "@mui/material";


export const Auth=()=>{

    const [isLogin,setIsLogin]=useState(false);
    const backgroundImage = 'https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxvZ2luJTIwcGFnZXxlbnwwfHwwfHx8MA%3D%3D';
    
    return(
        <div className="flex justify-center h-[90vh] items-center">
            <div 
                className="auth w-md h-[85vh] rounded-md shadow-lg relative overflow-hidden"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                
                {/* Form content */}
                <div className="relative z-10  px-10 h-full flex flex-col mt-30 mb-40">
                    <div className="bg-white bg-opacity-95 rounded-lg p-6">
                        {isLogin?<LoginForm/>:<SignUp/>}
                    </div>
                    <div className="flex items-center gap-1 justufy-center mt-5 px-15">
                        <p >{isLogin?"Don't have an acount":'Already have account'}</p>
                        <Button onClick={()=>setIsLogin(!isLogin)} className="text-bold">
                            {isLogin?'SignUp':'Login'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}