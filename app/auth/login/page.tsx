"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaGithub,
  FaSpinner,
} from "react-icons/fa";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="bg-card text-card-foreground p-8 rounded-lg shadow-lg w-full max-w-md border border-border">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back!</h2>

        {/* Error Message */}
        {error && (
          <p className="text-destructive text-center p-2 bg-destructive/10 border border-destructive rounded-md animate-fadeIn">
            {error}
          </p>
        )}

        {/* OAuth Buttons */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => handleOAuthLogin("google")}
            className="flex items-center justify-center bg-white text-black py-3 rounded-lg shadow hover:scale-105 transition transform duration-200 cursor-pointer"
            aria-label="Login with Google"
          >
            <FaGoogle className="mr-2" /> Continue with Google
          </button>
          <button
            onClick={() => handleOAuthLogin("github")}
            className="flex items-center justify-center bg-gray-900 text-white py-3 rounded-lg shadow hover:scale-105 transition transform duration-200 cursor-pointer"
            aria-label="Login with GitHub"
          >
            <FaGithub className="mr-2" /> Continue with GitHub
          </button>
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-border" />
          <span className="px-2 text-muted-foreground">OR</span>
          <hr className="flex-grow border-border" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          {/* Email Input */}
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

          {/* Password Input */}
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

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-primary text-primary-foreground py-3 rounded-lg hover:scale-105 transition transform duration-200 disabled:bg-gray-400 flex items-center justify-center cursor-pointer"
            disabled={isLoading}
            aria-label="Login"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : "Login"}
          </button>
        </form>

        {/* Bottom Text */}
        <p className="text-center text-muted-foreground mt-4">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="underline text-primary hover:text-primary/80"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
