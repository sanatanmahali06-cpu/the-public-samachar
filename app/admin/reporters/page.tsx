"use client";

import { FormEvent, useState } from "react";

export default function ReportersPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/reporters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          password,
          email,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Reporter create नहीं हुआ");
        return;
      }

      setMessage(`Reporter "${data.reporter.name}" successfully create हो गया।`);

      setName("");
      setUsername("");
      setPassword("");
      setEmail("");
      setPhone("");
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h1 className="text-3xl font-black">Add Reporter</h1>

          <p className="mt-2 text-sm text-slate-500">
            नया reporter account बनाएँ
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Reporter Name"
              required
              className="w-full rounded-xl border px-4 py-3 outline-none"
            />

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
              placeholder="Password (minimum 6 characters)"
              required
              minLength={6}
              className="w-full rounded-xl border px-4 py-3 outline-none"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              className="w-full rounded-xl border px-4 py-3 outline-none"
            />

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (optional)"
              className="w-full rounded-xl border px-4 py-3 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-950 px-4 py-3 font-bold text-white disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Reporter"}
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
