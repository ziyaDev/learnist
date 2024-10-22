import { NextRequest, NextResponse } from "next/server";
import { User } from '@supabase/auth-js'
import { parse } from "./utils/parse";
import { getDefaultSchool, isValidSchoolId } from "./utils/get-default-tenant";
import { dashboard_routes } from "@/components/layout/dashboard/side-bar";







export default async function AppMiddleware(req: NextRequest, user: User) {
   const { path, fullPath } = parse(req);
   const isSchoolInvite = req.nextUrl.searchParams.get("invite");
   const default_school_id = await getDefaultSchool(user);


   if (
      !default_school_id
      && path.startsWith("/dashboard")
   ) {
      return NextResponse.redirect(
         new URL(
            '/onboarding/create-school', req.url
         ),
      )
   }
   if (path === "/dashboard") {
      return NextResponse.redirect(
         new URL(
            `/dashboard/${default_school_id}`, req.url
         ),
      )
   }
   /* 
   * if path starts with /dashboard 
   * check if school id is valid
   * if not valid redirect to /not-found
   */
   if (path.startsWith('/dashboard')) {
      const schoolIdFromPath = new RegExp("^\\/dashboard\\/([^\\/]+)").exec(path);
      if (!schoolIdFromPath) return NextResponse.rewrite(new URL("/not-found", req.url));

      const isValid = await isValidSchoolId(schoolIdFromPath[1] || '', user);
      if (!schoolIdFromPath || !isValid) {
         return NextResponse.rewrite(new URL("/not-found", req.url));
      }
   }

   return NextResponse.next()
}
