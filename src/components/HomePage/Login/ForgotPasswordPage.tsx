import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Call API to send reset email
    setSent(true);

    // Simulate sending email and redirect to reset page with a fake token after a short delay
    setTimeout(() => {
      navigate("/reset-password?token=fake-demo-token");
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        {sent ? (
          <p className="text-green-400 text-center">
            If an account with that email exists, a reset link has been sent.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-400 font-semibold"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}