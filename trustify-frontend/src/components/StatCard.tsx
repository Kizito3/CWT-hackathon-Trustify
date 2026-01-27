const StatCard = ({ title, amount }: { title: string; amount: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm">
    <p className="text-black text-base mb-6">{title}</p>
    <div className="flex items-baseline gap-1 mb-8">
      <span className="text-[36px] font-bold text-gray-900">{amount}</span>
      <span className="text-[15px] text-black font-medium">(USD)</span>
    </div>
  </div>
);

export default StatCard;
