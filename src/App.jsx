import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useProfile } from './context/ProfileContext'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Categories from './pages/Categories'
import Analytics from './pages/Analytics'
import Budgets from './pages/Budgets'
import Settings from './pages/Settings'
import LoanCalculatorPage from './pages/LoanCalculatorPage'
import Notes from './pages/Notes'  // <-- ДОБАВИТЬ
import './styles/dashboard.css'
import './styles/categories.css'
import './styles/analytics.css'
import './styles/budgets.css'
import './styles/settings.css'
import './styles/loanCalculator.css'
import './styles/notes.css'  // <-- ДОБАВИТЬ

function AppContent() {
    const { appearance } = useProfile();

    useEffect(() => {
        if (appearance) {
            document.documentElement.setAttribute('data-density', appearance.density);
        }
    }, [appearance]);

    return (
        <div className="app">
            <Sidebar />
            <main className="main-content">
                <Header />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/budgets" element={<Budgets />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/loan-calculator" element={<LoanCalculatorPage />} />
                    <Route path="/notes" element={<Notes />} />  
                </Routes>
                <Footer />
            </main>
        </div>
    );
}

function App() {
    return <AppContent />;
}

export default App;