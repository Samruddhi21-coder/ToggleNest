import AuthLayout from "./AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout>
      <div
        className="
          w-full max-w-sm
          bg-[#0b0b0b]
          border border-[#1f1f1f]
          rounded-2xl
          px-7 py-8
          shadow-[0_0_35px_rgba(0,255,255,0.15)]
        "
      >
        <h2 className="text-2xl font-bold text-center text-cyan-400">
          Login
        </h2>

        <p className="text-center text-xs text-gray-400 mb-6">
          Access your dashboard
        </p>

        {/* FORM */}
        <form className="flex flex-col items-center gap-4">
          <input
            type="email"
            placeholder="Email"
            className="
              w-[1000]
              h-[500]
              px-3
              rounded-md
              bg-black
              border border-gray-700
              text-sm text-gray-200
              focus:outline-none
              focus:border-cyan-400
              focus:ring-1 focus:ring-cyan-400
            "
          />

          <input
            type="password"
            placeholder="Password"
            className="
              w-[1000]
              h-[500]
              px-3
              rounded-md
              bg-black
              border border-gray-700
              text-sm text-gray-200
              focus:outline-none
              focus:border-cyan-400
              focus:ring-1 focus:ring-cyan-400
            "
          />

          <button
            type="submit"
            className="
              w-[1000]
              h-[500]
              mt-1
              rounded-md
              bg-cyan-500
              text-black
              text-sm font-semibold
              hover:bg-cyan-400
              transition
              shadow-[0_0_16px_rgba(0,255,255,0.6)]
            "
          >
            Login
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          No account?{" "}
          <span className="text-cyan-400 hover:underline cursor-pointer">
            Register
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}
