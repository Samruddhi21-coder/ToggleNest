import AuthLayout from "./AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div className="
        w-full max-w-sm
        bg-[#0b0b0b]
        border border-[#1f1f1f]
        rounded-2xl
        px-7 py-8
        shadow-[0_0_35px_rgba(168,85,247,0.15)]
      ">
        <h2 className="text-2xl font-bold text-center text-purple-400">
          Register
        </h2>
        <p className="text-center text-xs text-gray-400 mb-6">
          Create your account
        </p>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full h-11 px-3 rounded-md bg-black border border-gray-700 text-sm text-gray-200 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full h-11 px-3 rounded-md bg-black border border-gray-700 text-sm text-gray-200 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full h-11 px-3 rounded-md bg-black border border-gray-700 text-sm text-gray-200 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          />

          <button
            className="
              w-full
              h-11
              rounded-md
              bg-purple-500
              text-black
              text-sm font-semibold
              hover:bg-purple-400
              transition
              shadow-[0_0_16px_rgba(168,85,247,0.6)]
            "
          >
            Register
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          Already registered?{" "}
          <span className="text-purple-400 hover:underline cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}
