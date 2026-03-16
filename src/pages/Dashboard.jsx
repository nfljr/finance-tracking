import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

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
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

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

  
  const filteredTransaction = transactions.filter((transactions) => {
    const keyword = search.toLowerCase();

    const matchSearch = 
    transactions.title.toLowerCase().includes(keyword) ||
    transactions.category.toLowerCase().includes(keyword);

    const matchType =
    filterType === "all" || transactions.type === filterType;

    const matchMonth = 
      !selectedMonth || transactions.date.startsWith(selectedMonth);

    return matchSearch && matchType && matchMonth;
  });

  function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  }

  const totalIncome = filteredTransaction
    .filter((transactions)=> transactions.type === "income")
    .reduce((total, transactions) => total + Number(transactions.amount), 0);

  const totalExpense = filteredTransaction
    .filter((transactions) => transactions.type === "expense")
    .reduce((total, transactions) => total + Number(transactions.amount), 0);

  const balance = totalIncome - totalExpense;

  const expenseByCategory = {};

  filteredTransaction
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

  const monthlyData = {};

  transactions.forEach((t) => {
    const month = t.date.slice(0 , 7);

    if (!monthlyData[month]){
      monthlyData[month] = {
        month: month,
        income: 0,
        expense: 0,
      };
    }

    if (t.type === "income") {
      monthlyData[month].income += t.amount;
    } else {
      monthlyData[month].expense += t.amount;
    }
  });

  const monthlyChartData = Object.values(monthlyData);

  const COLORS = [
    "#3B82F6",
    "#EF4444",
    "#22C55E",
    "#F59E0B",
    "#8B5CF6",
    "#14B8A6",
  ];

  return (
    <div className={`min-h-screen p-6 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
    }`}
    >
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-black"}`}>Personal Finance Tracker</h1>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="px-4 py-2 rounded bg-gray-800 text-white mb-6"
      >
        {darkMode ? "☀️light mode" : "🌙dark mode"}
      </button>
      <div className={`p-4 rounded-lg shadow mb-6 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-black"}`}>
              Expense by Category
            </h2>

            {chartData.length === 0 ? (
              <p className="text-gray-500">Belum ada data expense</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Tooltip/>
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
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
              </ResponsiveContainer>
            )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-10">
            <h2 className="text-xl font-semibold mb-4">
              Monthly Income vs Expense
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyChartData}
                margin={{top:20, right: 20, left: 20, bottom:20}}
              >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="month" />
                <YAxis/>
                <Tooltip/>
                <Legend/>

                <Bar dataKey="income" fill="#22C55E"/>
                <Bar dataKey="expense" fill="#EF4444"/>
              </BarChart>
            </ResponsiveContainer>
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

      <div className={`p-4 rounded-lg shadow mb-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
        <h2 className={` text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-black"} `}>Add New Transaction</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Transaction title"
            className={`border p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            className={`border p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            className={`border p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <select
            className={`border p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
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
            className={`border p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
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

      <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
        <h2 className={` text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-black"}`}>Transaction List</h2>

        <input 
          type="text" 
          placeholder="search by title or category..."
          className={`border p-2 rounded w-full mb-4 ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className={`border p-2 rounded w-full mb-4 ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input 
          type="month"
          className={` border p-2 rounded w-full mb-4 ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />

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
                  <h3 className={` font-semibold ${darkMode ? "text-white" : "bg-white"}`}>
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