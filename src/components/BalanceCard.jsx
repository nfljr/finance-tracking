export default function BalanceCard({title, amount, color}) {
    return (
        <div className={`p-4 rounded-xl shadow text-white ${color}`}>
            <h3 className="text-sm opacity-80">{title}</h3>
            <p className="text-2xl font-bold mt-2">
                Rp {amount.toLocaleString("id-ID")}
            </p>
        </div>
    )
}