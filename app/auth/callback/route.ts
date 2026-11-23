import { NextResponse } from "next/server";
import { supabaseSession } from "@/lib/supabase-server";
import { currentProfile, homeOf } from "@/lib/auth";
import { env } from "@/lib/env";

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code");
  if (code) {
    const { error } = await (await supabaseSession()).auth.exchangeCodeForSession(code);
    if (!error) {
      const p = await currentProfile();
      if (!p) return NextResponse.redirect(`${env.siteUrl}/?error=invite`);
      return NextResponse.redirect(`${env.siteUrl}${homeOf(p.role)}`);
    }
  }
  return NextResponse.redirect(`${env.siteUrl}/?error=link`);
}
