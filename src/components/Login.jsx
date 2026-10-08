
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import API_URL from "../api.js";

function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      if (!result.token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("token", result.token);

      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-screen">
      <div className="w-80 bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Email:
            </label>

            <input
              type="email"
              placeholder="Enter email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1">
              Password:
            </label>

            <input
              type="password"
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-xs mt-4">
          New account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold"
          >
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
