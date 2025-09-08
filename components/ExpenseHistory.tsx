
import React, { useMemo } from 'react';
import { Expense } from '../types';

interface ExpenseHistoryProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onClearAll: () => void;
}

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const ExpenseHistory: React.FC<ExpenseHistoryProps> = ({ expenses, onDeleteExpense, onClearAll }) => {
  const totalExpenses = useMemo(() => {
    return expenses.reduce((acc, expense) => acc + expense.amount, 0);
  }, [expenses]);

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses]);

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      alert("No expenses to export.");
      return;
    }

    const headers = "Date,Paid By,Description,Amount";
    const rows = sortedExpenses.map(e => {
      const description = `"${e.description.replace(/"/g, '""')}"`; // Escape quotes
      return [e.date, e.paidBy, description, e.amount].join(',');
    });

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "expenses.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Expense History</h2>
      <div className="mb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div className="flex gap-4">
            <p className="text-sm text-gray-600">Total expenses: <span className="font-medium text-gray-800">₹{totalExpenses.toFixed(2)}</span></p>
            <button onClick={handleExportCSV} className="text-sm text-indigo-500 hover:text-indigo-700 flex items-center">
                <i className="fas fa-file-csv mr-1"></i> Export CSV
            </button>
          </div>
          <button onClick={onClearAll} className="text-sm text-red-500 hover:text-red-700 flex items-center self-start sm:self-center">
              <i className="fas fa-trash mr-1"></i> Clear All
          </button>
      </div>
      <div className="border rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid By</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedExpenses.length > 0 ? (
              sortedExpenses.map(expense => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(expense.date)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {expense.paidBy}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{expense.description}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">₹{expense.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => onDeleteExpense(expense.id)} className="text-red-500 hover:text-red-700">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500">No expenses added yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseHistory;
