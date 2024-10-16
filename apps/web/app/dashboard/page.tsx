import { createServerClient } from "@/supabase/lib/server";
import { redirect } from "next/navigation";

export default async function Index() {
    const supabase = createServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return <>
        {user.email}</>
}