import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, } from "recharts";

export default function Dashboard() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");

    if (saved) {
      return JSON.parse(saved);
    }

    return [
      {
        id: 1,
        title: "Gaji Bulanan",
        amount: 5000000,
        type: "income",
        category: "Salary",
        date: "2026-03-10",
      },
      {
        id: 2,
        title: "Beli Makan",
        amount: 25000,
        type: "expense",
        category: "Food",
        date: "2026-03-12",
      },
    ];
  });

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  function addTransaction() {
    if (!title.trim() || !amount || !date) return;

    const newTransaction = {
      id: Date.now(),
      title: title,
      amount: Math.abs(Number(amount)),
      type: type,
      category: category,
      date: date,
    };

    setTransactions([...transactions, newTransaction]);

    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("Food");
    setDate("");
  }

  function deleteTransaction(id){
    setTransactions(transactions.filter((transactions)=> transactions.id !== id));
  }

  function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  }

  const totalIncome = transactions
    .filter((transactions)=> transactions.type === "income")
    .reduce((total, transactions) => total + Number(transactions.amount), 0);

  const totalExpense = transactions
    .filter((transactions) => transactions.type === "expense")
    .reduce((total, transactions) => total + Number(transactions.amount), 0);

  const balance = totalIncome - totalExpense;

  const expenseByCategory = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      if (!expenseByCategory[t.category]) {
        expenseByCategory[t.category] = 0;
      }

      expenseByCategory[t.category] += t.amount;
    });

  const chartData = Object.keys(expenseByCategory).map((key) => ({
    name: key,
    value: expenseByCategory[key],
  }));

  const COLORS = [
    "#3B82F6",
    "#EF4444",
    "#22C55E",
    "#F59E0B",
    "#8B5CF6",
    "#14B8A6",
  ];

  const filteredTransaction =transactions.filter((transactions) => {
    const keyword = search.toLowerCase();

    const matchSearch = 
    transactions.title.toLowerCase().includes(keyword) ||
    transactions.category.toLowerCase().includes(keyword);

    const matchType =
    filterType === "all" || transactions.type === filterType;

    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Personal Finance Tracker</h1>
      <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Expense by Category
            </h2>

            {chartData.length === 0 ? (
              <p className="text-gray-500">Belum ada data expense</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label = {({name, percent}) => 
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {chartData.map((entry, index) => (
                        <cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
              </ResponsiveContainer>
            )}
        </div>
        
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-500 text-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Income</h2>
            <p className="text-2xl font-bold mt-2">{formatRupiah(totalIncome)}</p>
        </div>

        <div className="bg-red-500 text-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Expense</h2>
            <p className="text-2xl font-bold mt-2">{formatRupiah(totalExpense)}</p>
        </div>

        <div className="bg-blue-500 text-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Balance</h2>
            <p className="text-2xl font-bold mt-2">{formatRupiah(balance)}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Transaction title"
            className="border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            className="border p-2 rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <select
            className="border p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Salary">Salary</option>
            <option value="Freelance">Freelance</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="date"
            className="border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            onClick={addTransaction}
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add Transaction
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Transaction List</h2>

        <input 
          type="text" 
          placeholder="search by title or category..."
          className="border p-2 rounded 2-full mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded w-full mb-4"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {filteredTransaction.length === 0 ? (
          <p className="text-gray-500">Transaksi Tidak ditemukan.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredTransaction.map((transaction) => (
              <div
                key={transaction.id}
                className="border rounded p-3 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {transaction.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {transaction.category} • {transaction.date}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`font-bold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatRupiah(Math.abs(transaction.amount))}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {transaction.type}
                  </p>

                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}