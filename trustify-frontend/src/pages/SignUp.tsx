import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Start the loading state immediately
    setIsLoading(true);

    try {
      await register(email, password);
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
      setConfirmPassword("");
    }
  };
  return (
    <div className="flex flex-col justify-center lg:items-center h-screen">
      <h2 className="text-[#0F172A] font-bold lg:text-[36px] text-center">
        Sign up for Trustify
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
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-[#FFF7F7] lg:w-172 w-full outline-0 shadow-lg lg:h-21.75 h-15 px-4 placeholder:text-lg placeholder:text-black placeholder:font-light text-base mt-4 lg:mt-11"
          placeholder="Confirm Password"
        />

        <div className="lg:mt-15 mt-5 flex justify-center items-center">
          <button
            // disabled={isLoading}
            className="bg-[#2563EB] font-bold w-full text-white px-44.5 lg:py-5.75 py-3 rounded-[10px] cursor-pointer active:scale-95 uppercase whitespace-nowrap disabled:bg-gray-400 flex justify-center items-center"
          >
            {isLoading ? <span>please wait..</span> : <span>sign in</span>}
          </button>
        </div>
        <div className="flex items-center mt-4 gap-2">
          <p>Have an account? </p>
          <Link to="/" className="text-[#2563EB]">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
