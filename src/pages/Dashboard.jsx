import BalanceCard from "../components/BalanceCard"
import TransactionList from "../components/TransactionList"
import { useState } from "react";

export default function Dashboard() {
    const [transactions, setTransactions] = useState([
        {
            id: 1, 
            title: "Lunch", 
            amount: -50000,
            type: "expense",
            category: "Food",
            date: "2026-03-14",
        },
        {
            id: 2, 
            title: "Salary", 
            amount: 5000000,
            type: "income",
            category: "job",
            date: "2026-03-14",
        }
    ]);

    const amounts = transactions.map(t => t.amount);
    const balance = amounts.reduce((acc, item) => acc + item, 0);
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc,item) => acc + item, 0);

    const expense = amounts
        .filter(item => item < 0)
        .reduce((acc,item) => acc + item, 0);

    const [title, SetTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("expense");
    const [category, setCategory] = useState("Food");
    const [date, setDate] = useState("");
    const [editingId, setEditingId] = useState(null);

    function addTransaction(){
        if (!title || !amount || !date) return;

        const numericAmount = Number(amount);

        const value = 
            type === "expense" 
            ? -Math.abs(numericAmount) 
            : Math.abs(numericAmount);
        
        if (editingId) {
            setTransactions(
                transactions.map((item) => 
                item.id === editingId
                ? {
                    ...item,
                    title,
                    amount: value,
                    type,
                    category,
                    date,
                }
                : item
                )
            );
            setEditingId(null);
        } else {
            const newTransaction = {
                id: Date.now(),
                title,
                amount: value,
                type,
                category,
                date,
            };

            setTransactions([newTransaction, ...transactions]);
        }

        SetTitle("");
        setAmount("");
        setType("expense");
        setCategory("Food");
        setDate("");
    }

    function deleteTransaction(id) {
        setTransactions(transactions.filter((item) => item.id !== id));
    }

    function editTransaction(item) {
        SetTitle(item.title);
        setAmount(Math.abs(item.amount));
        setType(item.type);
        setCategory(item.category);
        setDate(item.date);
        setEditingId(item.id);
    }

    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <h1 className="text-3xl font-bold mb-6">
                Finance Tracker
            </h1>

            <div className="grid grid-cols-3 gap-6">
                <BalanceCard
                    title="Balance"
                    amount={balance}
                    color="bg-blue-500"
                />

                <BalanceCard
                    title="income"
                    amount={income}
                    color="bg-green-500"
                />

                <BalanceCard
                    title="Expense"
                    amount={expense}
                    color="bg-red-500"
                />

            </div>

            <div className="bg-white p-4 rounded-xl shadow mt-6">
                <h2 className="text-lg font-semibold mb-4">
                    {editingId ? "Edit Transaction" : "Add Transaction"}
                </h2>

                <input
                    className="border p-2 rounded w-full mb-2"
                    placeholder="Title..."
                    value={title}
                    onChange={(e) => SetTitle(e.target.value)}
                />

                <input 
                    type="number"
                    className="border p-2 rounded w-full mb-2"
                    placeholder="amount..."
                    value={amount}
                    onChange={(e)=> setAmount(e.target.value)}
                />

                <select
                    className="border p-2 rounded 2-full mb-2"
                    value={type}
                    onChange={(e)=>setType(e.target.value)}
                >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>

                <select
                    className="border p-2 rounded w-full mb-2"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Health">Health</option>
                    <option value="Job">Job</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Other">Other</option>
                </select>

                <input 
                    type="date"
                    className="border p-2 rounded w-full mb-2"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <button
                    onClick={addTransaction}
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                >
                    {editingId ? "Update Transaction" : "Add Transaction"}
                </button>
            </div>
            
            <TransactionList 
                transactions={transactions}
                onDelete={deleteTransaction}
                onEdit={editTransaction}    
            />

        </div>
    );
}