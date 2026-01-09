// src/pages/AuthLayout.jsx
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Neon Glow */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] -top-20 -left-20" />
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] bottom-0 right-0" />

      {children}
    </div>
  );
}
