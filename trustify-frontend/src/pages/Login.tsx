import { useState } from "react";
import { useAuth } from "./../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Start the loading state immediately
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Login failed";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="flex flex-col justify-center lg:items-center h-screen">
      <h2 className="text-[#0F172A] font-bold lg:text-[36px] text-center">
        Sign in to Trustify
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#FFF7F7] w-full outline-0 shadow-lg lg:h-21.75 h-15 px-4 placeholder:text-lg placeholder:text-black placeholder:font-light text-base mt-4"
          placeholder="Enter your email address"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#FFF7F7] lg:w-172 w-full outline-0 shadow-lg lg:h-21.75 h-15 px-4 placeholder:text-lg placeholder:text-black placeholder:font-light text-base mt-4 lg:mt-11"
          placeholder="Enter your password"
        />

        <div className="lg:mt-15 mt-5 flex justify-center items-center">
          <button
            disabled={isLoading}
            className="bg-[#2563EB] font-bold w-full text-white px-44.5 lg:py-5.75 py-3 rounded-[10px] cursor-pointer active:scale-95 uppercase whitespace-nowrap disabled:bg-gray-400 flex justify-center items-center"
          >
            {isLoading ? <span>please wait..</span> : <span>login</span>}
          </button>
        </div>
        <div className="flex items-center mt-4 gap-2">
          <p>Don't have an account? </p>
          <Link to="/signup" className="text-[#2563EB]">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
