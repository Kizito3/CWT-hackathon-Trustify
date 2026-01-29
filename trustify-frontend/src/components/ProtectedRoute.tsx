import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BounceLoader } from "react-spinners";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center flex-col">
        <BounceLoader className="text-[#2563EB]" color="#2563EB" size={100} />
        <h1 className="text-[#2563EB] text-lg font-bold mt-4">Loading....</h1>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
