const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-copyright">
                    <span className="footer-logo">💰 FinControl</span>
                    <p>© {currentYear} — Управление финансами</p>
                </div>
                <div className="footer-links">
                    <a href="#" className="footer-link">📱 Мобильная версия</a>
                    <a href="#" className="footer-link">🔒 Безопасность</a>
                    <a href="#" className="footer-link">✉️ Поддержка</a>
                </div>
                <div className="footer-version">
                    <span>Версия 1.0.0</span>
                    <div className="footer-status">
                        <span className="status-dot"></span>
                        Все системы работают
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;