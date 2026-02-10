import instance from "@/api/axios";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Copy, Minus, Plus, Undo2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { BounceLoader } from "react-spinners";

type MonitorLinkItem = {
  token: string;
  walletId: string;
  createdAt: string;
};

export default function Wallet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<walletsProps | null>(null);
  const [transactions, setTransactions] = useState([]);
  const [monitorLinks, setMonitorLinks] = useState<MonitorLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState("inflow");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [processing, setProcessing] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const fetchWalletData = useCallback(async () => {
    try {
      const [walletRes, transactionsRes] = await Promise.all([
        instance.get(`/wallets/${id}`),
        instance.get(`/wallets/${id}/transactions`),
      ]);
      setWallet(walletRes.data.wallet);
      setTransactions(transactionsRes.data.transactions);
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
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchMonitorLinks = useCallback(async () => {
    try {
      const response = await instance.get<{ links: MonitorLinkItem[] }>(
        "/monitor/links",
      );
      const walletLinks = response.data.links.filter(
        (link: { walletId: string | undefined }) => link.walletId === id,
      );
      setMonitorLinks(walletLinks);
    } catch (error) {
      console.error("Failed to fetch monitor links:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchWalletData();
    fetchMonitorLinks();
  }, [fetchWalletData, fetchMonitorLinks]);

  const handleTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);
    setError("");

    try {
      await instance.post(`/wallets/${id}/${transactionType}`, {
        amount: parseFloat(amount),
        description,
      });
      setShowTransactionModal(false);
      setAmount("");
      setDescription("");
      fetchWalletData();
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
    } finally {
      setProcessing(false);
    }
  };

  const generateMonitorLink = async (): Promise<void> => {
    if (!id) return;

    setGeneratingLink(true);
    setError("");

    try {
      const response = await instance.post<{ token: string }>(
        `/monitor/generate/${id}`,
      );

      const newToken = response.data.token;

      // ✅ optimistic update so it shows immediately
      setMonitorLinks((prev) => [
        {
          token: newToken,
          walletId: id,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      // ✅ keep truth from backend (includes real createdAt)
      await fetchMonitorLinks();

      const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;
      const shareUrl = `${APP_URL}/monitor/${newToken}`;

      toast.success(`Monitor link generated!\n\nShare this URL:\n${shareUrl}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "failed to generate monitor link";
        toast.error(message);
      } else {
        toast.error("failed to generate monitor link");
      }
    } finally {
      setGeneratingLink(false);
    }
  };

  const copyToClipboard = async (token: string) => {
    const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;
    const url = `${APP_URL}/monitor/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(token);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedLink(token);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  const deleteMonitorLink = async (token: string) => {
    if (!confirm("Are you sure you want to revoke this monitor link?")) return;

    try {
      await instance.delete(`/monitor/links/${token}`);
      fetchMonitorLinks();
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
          Loading wallets...
        </h1>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-3xl font-bold">Wallet not found</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-[#2563EB] px-6 py-2 text-white rounded-2xl"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  return (
    <div className="">
      <button
        className="rounded-full bg-[#2563EB] p-3 text-white mb-5 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft />
      </button>

      {error && <div className="error-message">{error}</div>}

      <div className="flex items-center gap-4 lg:flex-row flex-col">
        <div className="flex justify-center lg:items-center flex-col bg-white w-full py-6 rounded-2xl px-3">
          <h1 className="font-bold lg:text-4xl text-xl lg:mb-3 ">
            {wallet.name}
          </h1>
          <p className="text-3xl font-bold text-[#2563EB] my-4">
            {formatCurrency(wallet.currentBalance)}
          </p>
          <p className="text-gray-400 flex flex-col justify-center lg:items-center">
            Created at{" "}
            <span className="font-bold">{formatDate(wallet.createdAt)}</span>
          </p>
        </div>

        <div className="actions-section bg-white w-full py-13 rounded-2xl px-3">
          <h1 className="text-3xl font-bold mb-6">Quick Actions</h1>
          <div className="flex justify-center lg:flex-row flex-col items-center gap-4">
            <button
              className="bg-[#2563EB] py-3 px-4 w-full font-bold rounded-md flex justify-center items-center text-white cursor-pointer"
              onClick={() => {
                setTransactionType("inflow");
                setShowTransactionModal(true);
              }}
            >
              <Plus /> Add Inflow
            </button>
            <button
              className="bg-[#ef4745] py-3 px-4 w-full flex justify-center items-center font-bold rounded-md text-white cursor-pointer"
              onClick={() => {
                setTransactionType("outflow");
                setShowTransactionModal(true);
              }}
            >
              <Minus /> Add Outflow
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white p-8 rounded-2xl mt-5 shadow-2xl ">
        <h1 className="font-bold text-2xl mb-3">🔗 Monitor Links</h1>
        <p className="text-gray-400 lg:text-lg text-sm mb-4">
          Generate shareable links to allow others to view (read-only) this
          wallet's balance and transactions.
        </p>

        {monitorLinks.length > 0 ? (
          <div className="bg-gray-50  p-4 rounded-lg">
            {monitorLinks.map((link: MonitorLinkItem) => (
              <div
                key={link.token}
                className="monitor-link-item flex justify-between lg:flex-row flex-col gap-6"
              >
                <div className="flex flex-col gap-2">
                  <span className="truncate">{`${window.location.origin}/monitor/${link.token}`}</span>
                  <span className="text-xs text-gray-500">
                    Created {formatDate(link.createdAt)}
                  </span>
                </div>
                <div className="link-actions flex justify-center items-center gap-4">
                  <button
                    className="btn-copy cursor-pointer"
                    onClick={() => copyToClipboard(link.token)}
                  >
                    {copiedLink === link.token ? (
                      <div className="flex items-center justify-center gap-2">
                        <span>
                          <Check size={15} />
                        </span>
                        <span className="text-sm lg:text-lg">Copied</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>
                          <Copy size={15} />
                        </span>
                        <span className="text-sm lg:text-lg">Copy</span>
                      </div>
                    )}
                  </button>
                  <button
                    className="btn-delete-small flex lg:text-lg text-sm items-center gap-2 cursor-pointer"
                    onClick={() => deleteMonitorLink(link.token)}
                  >
                    <Undo2 size={15} /> Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <button
            className=" disabled:bg-gray-500 border bg-[#2563EB] text-white cursor-pointer rounded-md lg:p-4 p-2 lg:text-base text-sm"
            onClick={generateMonitorLink}
            disabled={generatingLink}
          >
            {generatingLink ? "Generating..." : "Generate Monitor Link"}
          </button>
        )}

        {monitorLinks.length > 0 && (
          <button
            className="btn-secondary mt-2 disabled:bg-gray-500 border bg-[#2563EB] text-white cursor-pointer rounded-md lg:text-base text-sm lg:p-4 p-2"
            onClick={generateMonitorLink}
            disabled={generatingLink}
          >
            {generatingLink ? "Generating..." : "+ Generate New Link"}
          </button>
        )}
      </div>

      <div className="bg-white rounded-[32px] p-8 shadow-2xl border mt-8 border-slate-50 w-full">
        <h1 className="text-lg font-bold text-slate-800 mb-6">
          Recent Transactions
        </h1>
        {transactions.length === 0 ? (
          <p className="text-center font-bold text-3xl">
            No transactions yet. Add an inflow or outflow to get started.
          </p>
        ) : (
          <div className="space-y-6">
            {transactions.map((tx: transactionProps) => (
              <div
                key={tx._id}
                className="flex lg:items-center gap-2 lg:flex-row flex-col justify-between group cursor-pointer"
              >
                <div className="flex flex-col gap-2">
                  <span
                    className={`transaction-type font-bold text-xl ${tx.type}`}
                  >
                    {tx.type === "inflow" ? "⬆️" : "⬇️"} {tx.type.toUpperCase()}
                  </span>
                  <span className="transaction-description text-lg text-gray-600">
                    {tx.description}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {formatDate(tx.createdAt)}
                  </span>
                </div>
                <div className="flex flex-col lg:items-center">
                  <span
                    className={`transaction-amount text-gray-700 text-lg ${tx.type}`}
                  >
                    {tx.type === "inflow" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>
                  <span className="balance-after text-lg text-gray-700">
                    Balance: {formatCurrency(tx.balanceAfter)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* <TransactionList /> */}
      <AnimatePresence>
        {showTransactionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => setShowTransactionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
              className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-bold text-2xl text-gray-600 mb-4">
                {transactionType === "inflow"
                  ? "➕ Add Inflow"
                  : "➖ Add Outflow"}
              </h2>
              <form onSubmit={handleTransaction}>
                <div className="">
                  <label htmlFor="amount" className="mt-4">
                    <h1 className="text-gray-500">Amount</h1>
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div className="form-group mt-4">
                  <label htmlFor="description" className="mt-4">
                    <h1 className="text-gray-500">Description</h1>
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder={
                      transactionType === "inflow"
                        ? "e.g., Monthly budget"
                        : "e.g., Office supplies"
                    }
                  />
                </div>
                <div className="w-full flex justify-center items-center gap-4 mt-5">
                  <button
                    type="button"
                    className="w-full py-3 px-4 border rounded-md cursor-pointer"
                    onClick={() => setShowTransactionModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={
                      transactionType === "inflow"
                        ? "bg-[#2563EB] py-3 px-4 w-full rounded-md text-white cursor-pointer"
                        : "py-3 px-4 w-full rounded-md text-white bg-[#ef4745] cursor-pointer"
                    }
                    disabled={processing}
                  >
                    {processing ? "Processing..." : `Add ${transactionType}`}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
