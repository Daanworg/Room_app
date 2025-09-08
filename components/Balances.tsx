
import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Expense, Roommate, Balance } from '../types';
import { ROOMMATES } from '../constants';

interface BalancesProps {
  expenses: Expense[];
}

const Balances: React.FC<BalancesProps> = ({ expenses }) => {

  const { totalSpent, equalShare, balances, settlementInstructions } = useMemo(() => {
    if (expenses.length === 0) {
      const zeroBalances = ROOMMATES.map(r => ({ name: r, balance: 0 }));
      return { totalSpent: 0, equalShare: 0, balances: zeroBalances, settlementInstructions: [] };
    }

    const totalsPaid = ROOMMATES.reduce((acc, roommate) => {
      acc[roommate] = 0;
      return acc;
    }, {} as Record<Roommate, number>);

    expenses.forEach(expense => {
      totalsPaid[expense.paidBy] += expense.amount;
    });

    const totalSpent = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const equalShare = totalSpent / ROOMMATES.length;

    const calculatedBalances = ROOMMATES.map(roommate => ({
      name: roommate,
      balance: totalsPaid[roommate] - equalShare,
    }));

    // Settlement Logic
    const debtors = calculatedBalances.filter(b => b.balance < 0).map(b => ({ ...b }));
    const creditors = calculatedBalances.filter(b => b.balance > 0).map(b => ({ ...b }));
    const instructions: string[] = [];

    while (debtors.length > 0 && creditors.length > 0) {
      const debtor = debtors[0];
      const creditor = creditors[0];
      const amount = Math.min(Math.abs(debtor.balance), creditor.balance);

      instructions.push(`${debtor.name} should pay ${creditor.name} ₹${amount.toFixed(2)}`);

      debtor.balance += amount;
      creditor.balance -= amount;

      if (Math.abs(debtor.balance) < 0.01) debtors.shift();
      if (Math.abs(creditor.balance) < 0.01) creditors.shift();
    }

    return { totalSpent, equalShare, balances: calculatedBalances, settlementInstructions: instructions };
  }, [expenses]);
  
  const getBalanceText = (balance: Balance) => {
    if (Math.abs(balance.balance) < 0.01) {
        return 'Settled up';
    }
    if (balance.balance > 0) {
        return `Is owed ₹${balance.balance.toFixed(2)}`;
    }
    return `Owes ₹${Math.abs(balance.balance).toFixed(2)}`;
  };
  
  const getBalanceColor = (balance: number) => {
    if (balance > 0.01) return 'text-green-600';
    if (balance < -0.01) return 'text-red-600';
    return 'text-gray-700';
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Balances</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3 text-gray-700">Summary</h3>
          <div className="bg-indigo-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-indigo-700">Total Spent</span>
              <span className="font-medium">₹{totalSpent.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-indigo-700">Equal Share</span>
              <span className="font-medium">₹{equalShare.toFixed(2)}</span>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3 text-gray-700">Individual Balances</h3>
          <div className="space-y-3">
            {balances.map(b => (
                <div key={b.name} className="bg-white border rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">{b.name}</span>
                        <span className={`font-semibold ${getBalanceColor(b.balance)}`}>
                          {b.balance >= 0 ? `+₹${b.balance.toFixed(2)}` : `-₹${Math.abs(b.balance).toFixed(2)}`}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{getBalanceText(b)}</div>
                </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3 text-gray-700">Visualization</h3>
          <div className="w-full h-64 bg-gray-50 p-2 rounded-lg">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={balances} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                    <Bar dataKey="balance" fill="#4f46e5" />
                </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2 text-gray-800">Settlement Instructions:</h4>
            {settlementInstructions.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                    {settlementInstructions.map((inst, index) => <li key={index}>{inst}</li>)}
                </ul>
            ) : (
                <p className="text-green-600 font-medium">All balances are settled. No payments needed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balances;
