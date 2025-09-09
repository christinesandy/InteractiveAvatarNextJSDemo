// src/app/admin/register/page.tsx

"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterUserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("USER");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, name, role }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(`User '${data.username}' created successfully!`);
      // Clear the form
      setUsername("");
      setPassword("");
      setName("");
      setRole("USER");
    } else {
      setError(data.error || "Something went wrong.");
    }
  };

  // Protect the page from non-admins and logged-out users
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  
  if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
    // You can redirect or show an access denied message
    router.push('/'); // Redirect to home page
    return null; // Render nothing while redirecting
  }

  return (
    <div className="flex justify-center pt-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">
          Create a New User
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields for name, username, password, role */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md">
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button type="submit" className="w-full py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Create User
          </button>
          {message && <p className="text-sm text-center text-green-400">{message}</p>}
          {error && <p className="text-sm text-center text-red-400">{error}</p>}
        </form>
      </div>
    </div>
  );
}