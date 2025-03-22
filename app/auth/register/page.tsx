"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (res.status !== 201) {
      setError(data.message);
      setIsLoading(false);
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="bg-card text-card-foreground p-8 rounded-lg shadow-lg w-full max-w-md border border-border">
        <h2 className="text-3xl font-bold text-center mb-6">
          Create an Account
        </h2>

        {/* Error Message */}
        {error && (
          <p className="text-destructive text-center p-2 bg-destructive/10 border border-destructive rounded-md animate-fadeIn">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 border p-3 w-full rounded-lg bg-muted/20 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 border p-3 w-full rounded-lg bg-muted/20 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 border p-3 w-full rounded-lg bg-muted/20 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-primary-foreground py-3 rounded-lg hover:scale-105 transition transform duration-200 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-muted-foreground mt-4">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="underline text-primary hover:text-primary/80"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
