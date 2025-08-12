import { useState } from "react";

const mockData = [
    {
        vehicleName: "Toyota Camry 2022",
        hourly: 30,
        daily: 150,
        week: 900,
        monthly: 3200,
        lastReminder: "2025-08-01",
    },
    {
        vehicleName: "Honda Civic 2023",
        hourly: 28,
        daily: 140,
        week: 850,
        monthly: 3000,
        lastReminder: "2025-07-28",
    },
];

export default function PriceMatchingPage() {
    const [data, setData] = useState(mockData);

    const handleSendEmail = (idx: number) => {
        // Simulate sending email
        const updated = [...data];
        updated[idx].lastReminder = new Date().toISOString().slice(0, 10);
        setData(updated);
        alert(`Reminder sent for ${updated[idx].vehicleName}`);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Price Matching</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full border rounded-lg bg-white shadow">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="py-3 px-4 text-left">Vehicle Name</th>
                            <th className="py-3 px-4 text-left">Hourly Price</th>
                            <th className="py-3 px-4 text-left">Daily Price</th>
                            <th className="py-3 px-4 text-left">Weekly Price</th>
                            <th className="py-3 px-4 text-left">Monthly Price</th>
                            <th className="py-3 px-4 text-left">Send Email</th>
                            <th className="py-3 px-4 text-left">Last Reminder Sent On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => (
                            <tr key={row.vehicleName} className="border-b hover:bg-yellow-50 transition">
                                <td className="py-3 px-4">{row.vehicleName}</td>
                                <td className="py-3 px-4">{row.hourly}</td>
                                <td className="py-3 px-4">{row.daily}</td>
                                <td className="py-3 px-4">{row.week}</td>
                                <td className="py-3 px-4">{row.monthly}</td>
                                <td className="py-3 px-4">
                                    <button
                                        className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                                        onClick={() => handleSendEmail(idx)}
                                    >
                                        Send Email
                                    </button>
                                </td>
                                <td className="py-3 px-4">{row.lastReminder}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
