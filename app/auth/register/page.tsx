"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaGithub,
  FaSpinner,
} from "react-icons/fa";
import Link from "next/link";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      window.location.href = "/auth/login";
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthRegister = async (provider: "google" | "github") => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/auth/login" });
    } catch {
      setError("OAuth sign-in failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="bg-card text-card-foreground p-8 rounded-lg shadow-lg w-full max-w-md border border-border">
        <h2 className="text-3xl font-bold text-center mb-6">
          Create an Account
        </h2>

        {error && (
          <p className="text-destructive text-center p-2 bg-destructive/10 border border-destructive rounded-md animate-fadeIn">
            {error}
          </p>
        )}

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => handleOAuthRegister("google")}
            className="flex items-center justify-center bg-white text-black py-3 rounded-lg shadow hover:scale-105 transition transform duration-200 cursor-pointer"
            aria-label="Sign up with Google"
          >
            <FaGoogle className="mr-2" /> Sign up with Google
          </button>
          <button
            onClick={() => handleOAuthRegister("github")}
            className="flex items-center justify-center bg-gray-900 text-white py-3 rounded-lg shadow hover:scale-105 transition transform duration-200 cursor-pointer"
            aria-label="Sign up with GitHub"
          >
            <FaGithub className="mr-2" /> Sign up with GitHub
          </button>
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-border" />
          <span className="px-2 text-muted-foreground">OR</span>
          <hr className="flex-grow border-border" />
        </div>

        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Name"
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
            className="bg-primary text-primary-foreground py-3 rounded-lg hover:scale-105 transition transform duration-200 disabled:bg-gray-400 flex items-center justify-center cursor-pointer"
            disabled={isLoading}
            aria-label="Sign up"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="underline text-primary hover:text-primary/80"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
