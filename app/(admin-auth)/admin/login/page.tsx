"use client";

import { useActionState } from "react";
import { signInAdmin } from "@/app/actions/admin";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(signInAdmin, null);

  return (
    <div className="min-h-screen bg-ink p-6 text-white">
      <form action={action} className="mx-auto mt-24 max-w-md border border-white/20 bg-white p-8 text-ink">
        <h1 className="text-4xl font-black uppercase">DYT Admin</h1>
        <p className="mt-2 text-sm text-ink/60">Sign in with a Supabase Auth admin account.</p>
        <label className="mt-8 block text-sm font-black uppercase tracking-[0.14em]">
          Email
          <input name="email" type="email" required className="mt-2 w-full border border-ink/20 px-4 py-3 outline-none focus:border-blood" />
        </label>
        <label className="mt-4 block text-sm font-black uppercase tracking-[0.14em]">
          Password
          <input name="password" type="password" required className="mt-2 w-full border border-ink/20 px-4 py-3 outline-none focus:border-blood" />
        </label>
        {state?.error && <p className="mt-4 bg-blood/10 p-3 text-sm font-bold text-blood">{state.error}</p>}
        <button disabled={pending} className="mt-6 h-14 w-full bg-ink text-sm font-black uppercase tracking-[0.18em] text-white hover:bg-blood">
          {pending ? "Signing in" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
