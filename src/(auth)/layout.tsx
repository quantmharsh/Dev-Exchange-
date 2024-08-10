import { useAuthStore } from "@/store/Auth"
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Layout=({children}:{
    children: React.ReactNode
})=>{
  const {session}=useAuthStore();
  const router=useRouter();
  
  useEffect(() => {
    if(session)

        {
            router.push('/')
        }

  }, [session , router ])
  if(session)
  {
      return null;
  }
   //if we dont have  session then we will return the  all the childrens 
   //here in this  case childrens are  login , register pages (because they are under this layout )
  return (
    <div className="">
        <div className="">
            {children}
        </div>
    </div>
  )
  
}
export default Layout