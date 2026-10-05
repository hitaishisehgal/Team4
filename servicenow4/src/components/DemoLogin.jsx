import { useState } from "react";
import { demoAccounts } from "../data/demoAccounts";

function DemoLogin({ onLogin }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const account = demoAccounts.find(
      (candidate) =>
        candidate.id === identifier.trim().toLowerCase() &&
        candidate.password === password
    );

    if (!account) {
      setError("That demo ID and password don't match. Try one of the demo accounts.");
      return;
    }
    setError("");
    onLogin({
      id: account.id,
      role: account.role,
      name: account.name,
      studentId: account.studentId,
    });
  };

  const fillAccount = (account) => {
    setIdentifier(account.id);
    setPassword(account.password);
    setError("");
  };

  return (
    <main className="login-backdrop flex min-h-[calc(100vh-76px)] items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl shadow-indigo-950/10 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="login-aside flex flex-col justify-between p-7 text-white sm:p-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-indigo-50">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              A more human early warning
            </span>
            <h1 className="mt-8 max-w-sm text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              A small signal can start a meaningful conversation.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-indigo-100">
              Earlybird helps faculty and advisors notice academic engagement
              changes and offer timely support.
            </p>
          </div>
          <p className="mt-10 text-xs leading-5 text-indigo-200">
            Demo prototype only. These sample credentials are not secure
            authentication and protect no real student data.
          </p>
          <div aria-hidden="true" className="login-orb" />
        </section>

        <section className="p-6 sm:p-10">
          <p className="section-kicker">Welcome to Earlybird</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            Sign in to your view
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Use one of the demo accounts to explore role-specific screens.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                Demo ID
              </span>
              <input
                autoComplete="username"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="e.g. faculty"
                className="min-h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                Password
              </span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter demo password"
                className="min-h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                required
              />
            </label>
            {error && (
              <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="min-h-11 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-100" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Quick demo access
            </span>
            <span className="h-px flex-1 bg-slate-100" />
          </div>

          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => fillAccount(account)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-lg">
                  {account.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-slate-800">
                    {account.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] text-slate-500">
                    {account.description}
                  </span>
                </span>
                <span className="text-[10px] font-semibold text-indigo-600">
                  Fill
                </span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-center text-[10px] leading-4 text-slate-400">
            faculty / teach123 · advisor / guide123 · kabir / kabir123
          </p>
        </section>
      </div>
    </main>
  );
}

export default DemoLogin;
