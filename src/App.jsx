import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import Dashboard from './pages/Dashboard'
import './styles/dashboard.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<div style={{ padding: '40px', textAlign: 'center' }}>Страница транзакций (скоро)</div>} />
            <Route path="/categories" element={<div style={{ padding: '40px', textAlign: 'center' }}>Категории (скоро)</div>} />
            <Route path="/analytics" element={<div style={{ padding: '40px', textAlign: 'center' }}>Аналитика (скоро)</div>} />
            <Route path="/budgets" element={<div style={{ padding: '40px', textAlign: 'center' }}>Бюджеты (скоро)</div>} />
            <Route path="/settings" element={<div style={{ padding: '40px', textAlign: 'center' }}>Настройки (скоро)</div>} />
          </Routes>
          <Footer />
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App