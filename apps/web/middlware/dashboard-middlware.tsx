import { NextRequest, NextResponse } from "next/server";
import { User } from '@supabase/auth-js'
import { parse } from "./utils/parse";
import { getDefaultSchool, isValidSchoolId } from "./utils/get-default-tenant";
import { dashboard_routes } from "@/components/layout/dashboard/side-bar";







export default async function AppMiddleware(req: NextRequest, user: User) {
   const { path, fullPath } = parse(req);
   const isSchoolInvite = req.nextUrl.searchParams.get("invite");
   const school_id = await getDefaultSchool(user);
   const schoolIdFromPath = new RegExp("^\\/([^\\/]+)").exec(path);
   /*
   * if no tenant is found
   * if the tenant is not valid
   * redirect to the default tenant with requested path
   * if the requested path is not valid it fail with 404
  */
   if (!schoolIdFromPath || !(await isValidSchoolId(schoolIdFromPath[1], user))) {
      const newPath = `${school_id}/${path === "/" ? "" : fullPath}`
      return NextResponse.redirect(
         new URL(
            newPath, req.url
         ),
      )
   }
   // otherwise, rewrite the path to /app
   return NextResponse.next()
}
