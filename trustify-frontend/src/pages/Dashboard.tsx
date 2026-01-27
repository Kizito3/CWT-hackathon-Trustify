import StatCard from "@/components/StatCard";

export default function Dashboard() {
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

      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-8 grid grid-cols-3 gap-4">
          <StatCard title="Total Income" amount="$6,602.35" />
          <StatCard title="Total Income" amount="$6,602.35" />
          <StatCard title="Total Income" amount="$6,602.35" />
        </div>

        {/* <div className="col-span-3 bg-white p-6 rounded-2xl shadow-sm mt-4">
          <p className="text-sm font-medium text-gray-600 mb-4">
            Bring teammates into the project
          </p>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"
              />
            ))}
            <button className="w-10 h-10 rounded-full border-2 border-dashed border-blue-500 text-blue-500 flex items-center justify-center bg-blue-50">
              +
            </button>
          </div>
        </div> */}
      </div>
    </main>
  );
}
