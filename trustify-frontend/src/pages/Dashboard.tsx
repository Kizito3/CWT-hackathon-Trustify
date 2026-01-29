import instance from "@/api/axios";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { BounceLoader } from "react-spinners";

export default function Dashboard() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchWallets();
    console.log(fetchWallets());
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await instance.get("/wallets");
      setWallets(response.data.wallets);
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
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  const handleCreateWallet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);

    try {
      await instance.post("/wallets", {
        name: newWalletName,
        initialBalance: parseFloat(initialBalance) || 0,
      });
      setShowCreateModal(false);
      setNewWalletName("");
      setInitialBalance("");
      fetchWallets();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "failed to create wallet";
        toast.error(message);
      } else {
        toast.error("failed to create wallet");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteWallet = async (walletId: string) => {
    if (!confirm("Are you sure you want to delete this wallet?")) return;

    try {
      await instance.delete(`/wallets/${walletId}`);
      fetchWallets();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "failed to create wallet";
        toast.error(message);
      } else {
        toast.error("failed to delete wallet");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-col">
        <BounceLoader className="text-[#2563EB]" color="#2563EB" size={100} />
        <h1 className="text-[#2563EB] text-lg font-bold mt-4">
          Loading wallets...
        </h1>
      </div>
    );
  }
  return (
    <main className="flex-1 overflow-y-auto ">
      <header className="mb-8">
        <h2 className="lg:text-3xl text-base font-semibold text-black">
          Team Hera, track every move!
        </h2>
        <p className="text-black lg:text-xl text-sm mt-3">
          See your project finances clearly.
        </p>
      </header>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold lg:text-3xl text-base">Your Wallets</h1>
        <button
          className="bg-[#2563EB] px-6 py-2 text-white rounded-2xl"
          onClick={() => setShowCreateModal(true)}
        >
          + Create Wallet
        </button>
      </div>

      {wallets.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl">
          <div className="flex flex-col justify-center items-center">
            <h1 className="lg:text-3xl text-lg font-bold mb-4">
              No wallets yet
            </h1>
            <p className="text-sm text-gray-500">
              Create your first wallet to start tracking your finances.
            </p>
            <button
              className="bg-[#2563EB] whitespace-nowrap py-2 px-5 rounded-full text-white mt-5"
              onClick={() => setShowCreateModal(true)}
            >
              + Create Your First Wallet
            </button>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-5">
          {wallets.map((wallet: walletsProps) => (
            <div key={wallet._id} className="bg-white p-6 rounded-2xl">
              <div className="flex justify-between items-center lg:mb-8  mb-4">
                <h1 className="lg:text-3xl font-bold text-sm">{wallet.name}</h1>
                <button
                  className=" lg:w-8 lg:h-8 w-7 h-7 rounded-full flex justify-center items-center bg-red-400 cursor-pointer"
                  onClick={() => handleDeleteWallet(wallet._id)}
                  title="Delete wallet"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#fff"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                  </svg>
                </button>
              </div>
              <p className="text-[#2563EB] lg:text-4xl text-2xl font-bold mb-2">
                {formatCurrency(wallet.currentBalance)}
              </p>
              <p className="text-sm font-semibold text-gray-500 mb-4">
                Created {new Date(wallet.createdAt).toLocaleDateString()}
              </p>
              <Link
                to={`/dashboard/wallet/${wallet._id}`}
                className="w-full justify-center items-center lg:text-base text-xs flex uppercase bg-[#2563EB] py-2 text-white rounded-full"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            // Backdrop Animation
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              // Modal Card Animation
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
              className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Create New Wallet
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Set up a new budget category for your team.
                </p>
              </div>

              <form onSubmit={handleCreateWallet} className="space-y-5">
                {/* Wallet Name Input */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="walletName"
                    className="text-sm font-semibold text-slate-700 ml-1"
                  >
                    Wallet Name
                  </label>
                  <input
                    type="text"
                    id="walletName"
                    value={newWalletName}
                    onChange={(e) => setNewWalletName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="e.g., Marketing Budget"
                    required
                  />
                </div>

                {/* Balance Input */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="initialBalance"
                    className="text-sm font-semibold text-slate-700 ml-1"
                  >
                    Initial Balance{" "}
                    <span className="text-slate-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      id="initialBalance"
                      value={initialBalance}
                      onChange={(e) => setInitialBalance(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    className="flex-1 px-6 py-3 rounded-2xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-blue-400 disabled:shadow-none transition-all"
                    disabled={creating}
                  >
                    {creating ? "Creating..." : "Create Wallet"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-8 grid grid-cols-3 gap-4">
          <StatCard title="Total Income" amount="$6,602.35" />
          <StatCard title="Total Income" amount="$6,602.35" />
          <StatCard title="Total Income" amount="$6,602.35" />
        </div>

        
      </div> */}
    </main>
  );
}
