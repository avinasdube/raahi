import { useEffect, useMemo, useState } from "react";
import { currentUser, updateMe } from "../api/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { showError, showSuccess } from "../utils/toast";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await currentUser();
        if (!mounted) return;
        setUser(data?.user || null);
        setName(data?.user?.name || "");
      } catch {
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const onSave = async (e) => {
    e.preventDefault();
    if (saving) return;
    try {
      setSaving(true);
      const payload = { name };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      const { data } = await updateMe(payload);
      setUser(data?.user || null);
      showSuccess("Profile updated", "Saved");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed";
      showError(msg);
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl = useMemo(
    () =>
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        name || user?.email || "U"
      )}`,
    [name, user]
  );

  return (
    <>
      <Navbar />
      <main className="container pt-24 md:pt-28 pb-10 space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-5 shadow-card flex items-center justify-between gap-4 dark:border-slate-700">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Your Profile
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Manage your account information, avatar and password.
            </p>
          </div>
          {!loading && user && (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-16 h-16 rounded-full border border-slate-200 dark:border-slate-700"
            />
          )}
        </header>

        {loading ? (
          <div className="text-slate-600 dark:text-slate-300">Loading…</div>
        ) : !user ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            Please log in to manage your profile.
          </div>
        ) : (
          <form onSubmit={onSave} className="grid md:grid-cols-2 gap-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-4 dark:border-slate-700 dark:bg-slate-900">
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-200">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg h-10 px-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-200">
                  Email
                </label>
                <input
                  value={user.email}
                  disabled
                  className="w-full border border-slate-200 bg-slate-50 rounded-lg h-10 px-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                />
              </div>
              <div className="pt-2 text-xs text-slate-500 dark:text-slate-400">
                Tip: Your avatar uses your initials. Update your name to change
                it.
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Change password
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-200">
                  Current password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg h-10 px-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-200">
                  New password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg h-10 px-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Leave password fields empty if you only want to change your
                name.
              </p>
            </section>

            <div className="md:col-span-2 flex items-center justify-end gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
