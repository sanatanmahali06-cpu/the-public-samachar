"use client";

import { FormEvent, useState } from "react";

export default function ManagersPage() {
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
      const response = await fetch("/api/managers", {
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
        setMessage(data.error || "Manager create नहीं हुआ");
        return;
      }

      setMessage(
        `Manager "${data.manager.name}" successfully create हो गया।`
      );

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
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <a
            href="/admin"
            className="font-bold text-blue-600 hover:underline"
          >
            ← Back to Admin
          </a>

          <h1 className="mt-4 text-3xl font-black">
            Create Manager
          </h1>

          <p className="mt-1 text-slate-600">
            Admin यहाँ से Manager ID बना सकता है।
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-bold">
                Name
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Manager name"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">
                Username
              </label>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="manager username"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">
                Email <span className="font-normal text-slate-400">(Optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="manager@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">
                Phone <span className="font-normal text-slate-400">(Optional)</span>
              </label>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Phone number"
              />
            </div>
          </div>

          {message && (
            <div className="mt-5 rounded-xl bg-slate-100 px-4 py-3 font-bold">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 rounded-xl bg-slate-900 px-6 py-3 font-black text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Manager"}
          </button>
        </form>
      </div>
    </main>
  );
}