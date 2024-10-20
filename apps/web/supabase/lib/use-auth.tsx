'use client'

import { User, Session } from "@supabase/supabase-js";
import useSupabase from "@/supabase/lib/use-supabase";
import { useQuery } from "@tanstack/react-query";
import { create } from 'zustand';
import { useParams } from "next/navigation";

// Extend Supabase User with custom fields
interface IUser extends User {
   school: {
      id: number;
   };
}

// Zustand store for auth management
type AuthState = {
   user: IUser | null;
   setUser: (user: IUser | null) => void;
};

// Zustand hook for managing authentication state
export const useAuth = create<AuthState>((set) => ({
   user: null,
   setUser: (user) => set({ user }),
}));

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const supabase = useSupabase();
   const { tenant } = useParams<{ tenant: string }>();
   useQuery({
      queryKey: ['user'],
      queryFn: async () => {
         const { data, error } = await supabase.auth.getUser();
         if (error || !data) {
            useAuth.getState().setUser(null);
            return null;
         }
         // Set user with school ID based on tenant from params
         const userWithSchool: IUser = {
            ...data.user,
            school: { id: Number(tenant) },
         };
         useAuth.getState().setUser(userWithSchool);

         return data.user;
      },
      retry: 1,
   });

   return children;
};
