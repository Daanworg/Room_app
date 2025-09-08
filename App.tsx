
import React, { useState, useCallback } from 'react';
import { Expense, Roommate, Tab } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Tabs from './components/Tabs';
import AddExpense from './components/AddExpense';
import ExpenseHistory from './components/ExpenseHistory';
import Balances from './components/Balances';
import Notification from './components/Notification';

function App() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('roommate-expenses', []);
  const [activeTab, setActiveTab] = useState<Tab>('add');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addExpense = useCallback((expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
    };
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    showNotification('Expense added successfully!');
  }, [setExpenses]);

  const deleteExpense = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
      showNotification('Expense deleted successfully!');
    }
  }, [setExpenses]);

  const clearAllExpenses = useCallback(() => {
    if (expenses.length > 0 && window.confirm('Are you sure you want to delete ALL expenses? This cannot be undone.')) {
      setExpenses([]);
      showNotification('All expenses cleared!');
    }
  }, [expenses.length, setExpenses]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'add':
        return <AddExpense onAddExpense={addExpense} />;
      case 'history':
        return <ExpenseHistory expenses={expenses} onDeleteExpense={deleteExpense} onClearAll={clearAllExpenses} />;
      case 'balance':
        return <Balances expenses={expenses} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {notification && <Notification message={notification.message} type={notification.type} />}
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-2">Roommate Expense Splitter</h1>
        <p className="text-gray-600">Track and split expenses equally among Althaf, Jamzith & Rasheed</p>
      </header>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
