import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Management() {
  const [qrShown, setQrShown] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  return (
    <>
      <Navbar />
      <main className="container pt-24 md:pt-28 pb-10 space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h1 className="text-2xl md:text-3xl font-extrabold">
            Smart Hotel Management
          </h1>
          <p className="text-slate-600">
            Contactless check-in/out via QR or Face ID (mock). Digital room keys
            and faster reception experience.
          </p>
        </header>
        <section className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-xl font-bold">Contactless Check-in</h2>
            <p className="text-sm text-slate-600">
              Step 1: Verify identity • Step 2: Scan QR • Step 3: Receive
              digital key
            </p>
            <div className="mt-4 flex gap-2">
              <button
                className="btn btn-outline"
                onClick={() => setQrShown(true)}
              >
                Show QR
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setCheckedIn(true)}
              >
                Face ID (Mock)
              </button>
            </div>
            {qrShown && (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-center">
                <div className="text-sm text-slate-600">Guest QR Code</div>
                <div className="mt-2 h-40 bg-[repeating-linear-gradient(45deg,theme(colors.slate.200),theme(colors.slate.200)_10px,theme(colors.slate.300)_10px,theme(colors.slate.300)_20px)] rounded" />
              </div>
            )}
            {checkedIn && (
              <div className="mt-4 rounded-xl bg-[var(--brand)]/10 border border-[var(--brand)]/30 p-3 text-sm">
                Checked-in successfully. Your digital key is active for Room
                304.
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-xl font-bold">Digital Room Key</h2>
            <p className="text-sm text-slate-600">
              Tap to unlock (proximity mock). Key valid for your stay duration.
            </p>
            <button className="mt-4 btn btn-primary">Unlock Door</button>
            <div className="mt-3 text-xs text-slate-500">
              For demo only. Integrate with actual lock provider for production.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
