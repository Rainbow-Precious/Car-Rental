
import React, { useState, type FormEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    // TODO: Call API to reset password with token
    setSuccess(true);
    setTimeout(() => navigate("/login"), 2000);
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="bg-gray-900 p-8 rounded shadow-md">
          <p className="text-red-400">Invalid or missing reset token.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        {success ? (
          <p className="text-green-400 text-center">
            Password reset! Redirecting to login...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              required
              placeholder="New password"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              required
              placeholder="Confirm new password"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {error && <p className="text-red-400">{error}</p>}
            <button
              type="submit"
              className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-400 font-semibold"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;