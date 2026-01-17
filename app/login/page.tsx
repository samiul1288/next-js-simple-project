import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <Suspense fallback={<div>Loading...</div>}>
        <LoginClient />
      </Suspense>

      <p className="text-sm text-gray-600 mt-4">
        Use: <b>test@example.com</b> / <b>password123</b>
      </p>
    </div>
  );
}
