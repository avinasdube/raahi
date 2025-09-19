import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login, signup } from "../api/api.js";
import hawamahal from "../assets/hawamahal.jpg";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
// API_BASE_URL comes from utils/index.js, which api.js also uses via utils/constants.js
import { useAuth } from "../hooks/useAuth";
import { API_BASE_URL } from "../utils/index.js";

const Tab = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
      active
        ? "bg-[var(--brand)] text-white border-[var(--brand)]"
        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
    }`}
  >
    {children}
  </button>
);

export default function Auth() {
  const { setUser } = useAuth();
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/";
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const title = useMemo(
    () => (mode === "login" ? "Welcome back" : "Create your account"),
    [mode]
  );

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!form.email.trim()) return "Email is required";
    // Basic email test
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()))
      return "Enter a valid email";
    if (!form.password) return "Password is required";
    if (mode === "signup") {
      if (!form.firstName.trim()) return "First name is required";
      if (!form.lastName.trim()) return "Last name is required";
      if (!form.agree) return "You must agree to the terms";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setSuccess("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setLoading(true);
      if (mode === "login") {
        const res = await login({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        });
        const ok = res?.status === 200 || res?.status === 201;
        console.log(res.data);
        if (!ok) throw new Error(res?.data?.message || "Login failed");
        // Persist token for Authorization header fallback and set user in context
        try {
          if (res.data?.token)
            localStorage.setItem("raahi.token", res.data.token);
        } catch {
          /* ignore storage errors */
        }
        setUser(res.data?.user || null);
        setSuccess("Logged in successfully");
        navigate(next);
      } else {
        const payload = {
          fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        };
        console.log(payload);
        const res = await signup(payload);
        const ok = res?.status === 201 || res?.status === 200;
        if (!ok) throw new Error(res?.data?.message || "Signup failed");
        // Auto-login on successful signup
        try {
          if (res.data?.token)
            localStorage.setItem("raahi.token", res.data.token);
        } catch {
          /* ignore storage errors */
        }
        setUser(res.data?.user || null);
        setSuccess("Account created! You are now logged in.");
        navigate(next);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Request failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-28 pb-12">
        <div className="container grid lg:grid-cols-2 gap-6 md:gap-10 items-stretch">
          <div className="hidden lg:block rounded-3xl overflow-hidden border border-slate-200 shadow-card">
            <div
              className="h-full min-h-[420px] bg-cover bg-center"
              style={{ backgroundImage: `url(${hawamahal})` }}
            >
              <div className="h-full w-full bg-black/30" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold">{title}</h1>
              <div className="flex gap-2">
                <Tab active={mode === "login"} onClick={() => setMode("login")}>
                  Log in
                </Tab>
                <Tab
                  active={mode === "signup"}
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </Tab>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      First name
                    </label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={onChange}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-4 h-12"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Last name
                    </label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={onChange}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-4 h-12"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 h-12"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 h-12"
                />
              </div>

              {mode === "signup" && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    name="agree"
                    type="checkbox"
                    checked={form.agree}
                    onChange={onChange}
                    className="accent-[var(--brand)]"
                  />
                  <span>I agree to the Terms & Privacy Policy.</span>
                </div>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}

              <button
                type="submit"
                disabled={loading || (mode === "signup" && !form.agree)}
                className="btn btn-primary w-full h-12 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? mode === "login"
                    ? "Logging in..."
                    : "Creating account..."
                  : mode === "login"
                  ? "Log in"
                  : "Create account"}
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-xs text-slate-500">or</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <button
                type="button"
                onClick={() => {
                  // Optional: Redirect to server's Google OAuth route if available
                  window.location.href = `${API_BASE_URL}/auth/google`;
                }}
                className="w-full h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-50"
              >
                Continue with Google
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600">
              {mode === "login" ? (
                <>
                  New to Raahi?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-[var(--brand)] font-semibold hover:underline"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-[var(--brand)] font-semibold hover:underline"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
