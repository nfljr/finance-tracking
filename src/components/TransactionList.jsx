export default function TransactionList({transactions, onDelete, onEdit}) {
    return (
        <div className="bg-white p-4 rounded-xl shadow mt-6">
            <h2 className="text-lg font-semibold mb-4">Recent Transaction</h2>

        {transactions.length === 0 ? (
            <p className="text-gray-500">No Transaction yet.</p>
        ) : (
            transactions.map((t) => (
                <div
                    key={t.id}
                    className="flex justify-between items-center border-b py-3"
                >
                    <div>
                        <p className="font-medium">{t.title}</p>
                        <p className="text-sm text-gray-500">
                            {t.category} • {t.date}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className={t.amount < 0 ? "text-red-500" : "text-green-500"}>
                            Rp {Math.abs(t.amount).toLocaleString("id-ID")}
                        </p>

                        <div>
                            <button
                                onClick={() => onEdit(t)}
                                className="text-blue-500 text-sm"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(t.id)}
                                className="text-red-500 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))
        )}
        </div>
    );
}