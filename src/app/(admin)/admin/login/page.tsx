import Link from "next/link";
import LoginForm from "@/components/admin/LoginForm";
export default function Login() {
  return (
    <main id="main-content" className="admin-login">
      <Link href="/" className="wordmark">
        VP.
      </Link>
      <h1>Welcome back.</h1>
      <p className="muted">Sign in to your content studio.</p>
      <LoginForm />
    </main>
  );
}
