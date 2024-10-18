'use client'
import { createContext, useContext, useEffect, useState } from "react"
import { User, UserResponse } from "@supabase/supabase-js"
import { createClient } from "@/supabase/lib/client"
import { useParams } from "next/navigation"
interface IUser extends User {
   school_id: number
}

const userContext = createContext<IUser | null>(null)

export const useAuth = () => {
   const context = useContext(userContext)
   if (!context) throw new Error("AuthProvider not found")
   return context
}
export const AuthProvider = ({ children }: {
   children: React.ReactNode
}) => {
   const [user, setUser] = useState<IUser | null>(null)
   const params = useParams()
   const school_id = params.tenant as string
   useEffect(() => {
      const supabase = createClient()
      const fetchUser = async () => {
         await supabase.auth.getUser()
            .then(({ data: { user }, error }) => {
               if (!user || error || !school_id) {
                  setUser(null)
               }
               // @ts-ignore 
               setUser({ ...user, school_id: Number(school_id) })
            })
      }
      fetchUser()
      return () => {
         setUser(null)
      }
   }, [])
   return <userContext.Provider value={user}>
      {children}
   </userContext.Provider>
}



