"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  username: string;
  email: string | null;
  phone: string | null;
  status: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [reporters, setReporters] = useState<User[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function convertUser(
    id: number,
    fromRole: "reporter" | "manager"
  ) {
    const targetRole = fromRole === "reporter" ? "Manager" : "Reporter";

    if (!window.confirm(`Is user ko ${targetRole} banana hai?`)) {
      return;
    }

    setActionLoading(`${fromRole}-convert-${id}`);

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, fromRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Role conversion failed");
        return;
      }

      alert(data.message || "Role converted successfully");
      await loadUsers();
    } catch {
      alert("Role conversion failed");
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteUser(
    id: number,
    role: "reporter" | "manager"
  ) {
    if (!window.confirm(`ID ${id} wale ${role} ko delete karna hai?`)) {
      return;
    }

    setActionLoading(`${role}-delete-${id}`);

    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Delete failed");
        return;
      }

      alert(data.message || "User deleted successfully");
      await loadUsers();
    } catch {
      alert("Delete failed");
    } finally {
      setActionLoading(null);
    }
  }

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/users");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Users load failed");
      }

      setReporters(data.reporters || []);
      setManagers(data.managers || []);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Users load failed"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-2xl bg-slate-950 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-300">
                THE PUBLIC SAMACHAR
              </p>

              <h1 className="mt-1 text-3xl font-black">
                User & Role Management
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                Manage Reporter and Manager accounts
              </p>
            </div>

            <a
              href="/admin"
              className="rounded-xl bg-white px-5 py-3 text-center font-bold text-slate-950"
            >
              Back to Admin
            </a>
          </div>
        </header>

        {loading && (
          <div className="mt-6 rounded-2xl bg-white p-6 font-bold shadow-sm">
            Users loading...
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 p-6 font-bold text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <section className="mt-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-black">
                  Reporters
                </h2>

                <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-black text-orange-700">
                  {reporters.length}
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-5 py-4 text-left text-sm font-black">
                        ID
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black">
                        Name
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black">
                        Username
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black">
                        Email
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black">
                        Phone
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black">
                        Status
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {reporters.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-8 text-center font-bold text-slate-500"
                        >
                          No reporters found.
                        </td>
                      </tr>
                    ) : (
                      reporters.map((user) => (
                        <tr
                          key={user.id}
                          className="border-t border-slate-100"
                        >
                          <td className="px-5 py-4 font-bold">
                            {user.id}
                          </td>
                          <td className="px-5 py-4 font-bold">
                            {user.name}
                          </td>
                          <td className="px-5 py-4">
                            @{user.username}
                          </td>
                          <td className="px-5 py-4">
                            {user.email || "-"}
                          </td>
                          <td className="px-5 py-4">
                            {user.phone || "-"}
                          </td>
                          <td className="px-5 py-4">
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                              {user.status}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => convertUser(user.id, "reporter")}
                                disabled={actionLoading !== null}
                                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-black text-white disabled:opacity-50"
                              >
                                {actionLoading === `reporter-convert-${user.id}`
                                  ? "..."
                                  : "Make Manager"}
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteUser(user.id, "reporter")}
                                disabled={actionLoading !== null}
                                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-black text-white disabled:opacity-50"
                              >
                                {actionLoading === `reporter-delete-${user.id}`
                                  ? "..."
                                  : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-black">
                  Managers
                </h2>

                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-black text-blue-700">
                  {managers.length}
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-5 py-4 text-left text-sm font-black">
                        ID
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black">
                        Name
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black">
                        Username
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black">
                        Email
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black">
                        Phone
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black">
                        Status
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {managers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-8 text-center font-bold text-slate-500"
                        >
                          No managers found.
                        </td>
                      </tr>
                    ) : (
                      managers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-t border-slate-100"
                        >
                          <td className="px-5 py-4 font-bold">
                            {user.id}
                          </td>
                          <td className="px-5 py-4 font-bold">
                            {user.name}
                          </td>
                          <td className="px-5 py-4">
                            @{user.username}
                          </td>
                          <td className="px-5 py-4">
                            {user.email || "-"}
                          </td>
                          <td className="px-5 py-4">
                            {user.phone || "-"}
                          </td>
                          <td className="px-5 py-4">
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                              {user.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => convertUser(user.id, "manager")}
                                disabled={actionLoading !== null}
                                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-black text-white disabled:opacity-50"
                              >
                                {actionLoading === `manager-convert-${user.id}`
                                  ? "..."
                                  : "Make Reporter"}
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteUser(user.id, "manager")}
                                disabled={actionLoading !== null}
                                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-black text-white disabled:opacity-50"
                              >
                                {actionLoading === `manager-delete-${user.id}`
                                  ? "..."
                                  : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}