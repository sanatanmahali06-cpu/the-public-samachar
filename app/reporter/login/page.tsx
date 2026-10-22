"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReporterLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/reporter/login", {
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

      setMessage("Login successful");
      router.push("/reporter/dashboard");
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h1 className="text-3xl font-black">Reporter Login</h1>

          <p className="mt-2 text-sm text-slate-500">
            Reporter account se login karein
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full rounded-xl border px-4 py-3 outline-none"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full rounded-xl border px-4 py-3 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-950 px-4 py-3 font-bold text-white disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {message && (
            <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm">
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
