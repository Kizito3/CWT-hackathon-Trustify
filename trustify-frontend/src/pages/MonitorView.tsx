import instance from "@/api/axios";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { BounceLoader } from "react-spinners";

export default function MonitorView() {
  const { token } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wallet, setWallet] = useState<walletsProps | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, transactionsRes] = await Promise.all([
          instance.get(`/monitor/${token}`),
          instance.get(`/monitor/${token}/transactions`),
        ]);
        setWallet(walletRes.data.wallet);
        setTransactions(transactionsRes.data.transactions);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            "failed to create wallet";
          setError(message);
          toast.error(message);
        } else {
          toast.error("failed to delete wallet");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-col">
        <BounceLoader className="text-[#2563EB]" color="#2563EB" size={100} />
        <h1 className="text-[#2563EB] text-lg font-bold mt-4">
          Loading wallet data
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center bg-white p-5 w-full rounded-2xl">
        <div className="error-card">
          <h2>⚠️ Access Denied</h2>
          <p className="text-red-400">{error}</p>
          <p className="text-red-200 font-bold text-lg">
            The monitor link may have been revoked or doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="monitor-view">
      <div className="flex flex-col items-center justify-center">
        <span className="read-only-badge">👁️ Read-Only View</span>
        <h1 className="font-bold text-2xl">💰 {wallet?.name}</h1>
        <h1 className="text-gray-400 my-4">Trusify - Public Monitor</h1>
      </div>

      <div className="flex justify-center items-center w-full ">
        <div className="bg-white shadow-lg p-10 flex flex-col justify-center items-center  rounded-2xl">
          <h1 className=" text-sm mb-4 text-gray-600 font-semibold">
            Current Balance
          </h1>
          <p className="text-[#2563EB] text-3xl font-bold">
            {formatCurrency(wallet?.currentBalance ?? 0)}
          </p>
          <p className="my-6 text-gray-600">
            Wallet created: {wallet ? formatDate(wallet.createdAt) : "N/A"}
          </p>
        </div>
      </div>

      {/* Centering Wrapper: h-full or min-h-screen ensures it has space to center vertically */}
      <div className="w-full flex justify-center items-start py-10 min-h-full">
        {/* The Card Container - Fixed at 600px wide */}
        <div className="w-full max-w-150 px-4">
          <div className="bg-white rounded-[32px] p-8 shadow-2xl border border-slate-50">
            <h1 className="text-lg font-bold text-slate-800 mb-8">
              Recent Transactions
            </h1>

            {transactions.length === 0 ? (
              <div className="flex flex-col items-center py-10">
                <p className="text-slate-400 font-medium">
                  No transactions recorded yet.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {" "}
                {/* Added spacing between transaction rows */}
                {transactions.map((tx: transactionProps) => (
                  <div
                    key={tx._id}
                    className="flex items-center gap-6 justify-between group cursor-pointer hover:bg-slate-50/50 p-2 rounded-2xl transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <span
                        className={`flex items-center lg:text-base gap-2 font-bold text-xs uppercase tracking-wider ${
                          tx.type === "inflow"
                            ? "text-emerald-500"
                            : "text-rose-500"
                        }`}
                      >
                        {tx.type === "inflow" ? "⬆️" : "⬇️"} {tx.type}
                      </span>
                      <span className="font-semibold text-slate-700 text-base">
                        {tx.description}
                      </span>
                      <span className="text-slate-400 text-xs font-medium">
                        {formatDate(tx.createdAt)}
                      </span>
                    </div>

                    <div className="text-right flex flex-col gap-1">
                      <span
                        className={`lg:text-lg font-bold text-sm ${
                          tx.type === "inflow"
                            ? "text-emerald-600"
                            : "text-slate-900"
                        }`}
                      >
                        {tx.type === "inflow" ? "+" : "-"}{" "}
                        {formatCurrency(tx.amount)}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        Balance:{" "}
                        <span className="text-slate-600">
                          {formatCurrency(tx.balanceAfter)}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-gray-600">
        <p>
          This is a read-only view. You cannot make any changes to this wallet.
        </p>
        <p className="powered-by">Powered by Trustify</p>
      </div>
    </div>
  );
}
