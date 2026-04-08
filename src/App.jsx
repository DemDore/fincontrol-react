import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Categories from './pages/Categories'
import Analytics from './pages/Analytics'
import Budgets from './pages/Budgets'
import Settings from './pages/Settings'
import './styles/dashboard.css'
import './styles/categories.css'
import './styles/analytics.css'
import './styles/budgets.css'
import './styles/settings.css'

function App() {
  return (
    <BrowserRouter>
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
          </Routes>
          <Footer />
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App