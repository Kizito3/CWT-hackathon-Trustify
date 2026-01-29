interface Transaction {
  id: string;
  name: string;
  status: "Successful" | "Unsuccessful";
  amount: string;
  avatar: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    name: "Marun Adisa",
    status: "Successful",
    amount: "$6,602.35",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: "2",
    name: "Marun Adisa",
    status: "Unsuccessful",
    amount: "$6,602.35",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: "3",
    name: "Marun Adisa",
    status: "Successful",
    amount: "$6,602.35",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: "4",
    name: "Marun Adisa",
    status: "Unsuccessful",
    amount: "$6,602.35",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: "5",
    name: "Marun Adisa",
    status: "Successful",
    amount: "$6,602.35",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
];

const TransactionList = () => {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 w-full">
      <h3 className="text-lg font-bold text-slate-800 mb-6">
        Recent Transactions
      </h3>

      <div className="space-y-6">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between group cursor-pointer"
          >
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 border border-slate-100">
                <img
                  src={tx.avatar}
                  alt={tx.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="font-bold text-slate-800 text-sm">{tx.name}</p>
                <p
                  className={`text-xs font-medium mt-0.5 ${
                    tx.status === "Successful"
                      ? "text-emerald-500"
                      : "text-rose-500"
                  }`}
                >
                  Transaction {tx.status}
                </p>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right">
              <span className="text-sm font-bold text-slate-700">
                {tx.amount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
