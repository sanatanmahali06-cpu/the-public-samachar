"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeLoginButton() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Login failed");
        return;
      }

      setOpen(false);

      if (data.redirect) {
        router.push(data.redirect);
      }
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setMessage("");
        }}
        className="rounded-md bg-red-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-red-700 sm:px-3 sm:py-1.5 sm:text-sm"
      >
        Login
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Login
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Admin या Reporter account से login करें
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-2xl font-bold text-slate-500 hover:text-slate-900"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username / ID"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-red-500"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-red-500"
              />

              {message && (
                <div className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}