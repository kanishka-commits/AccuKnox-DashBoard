import React, { useState, useEffect } from 'react';
import { useDashboardStore } from './store';
import CategorySection from './components/CategorySection';
import AddWidgetModal from './components/AddWidgetModal';
import './App.css';

function App() {
  const layout = useDashboardStore((state) => state.layout);
  const theme = useDashboardStore((state) => state.theme);
  const toggleTheme = useDashboardStore((state) => state.toggleTheme);
  const resetLayout = useDashboardStore((state) => state.resetLayout);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const body = document.body;
    body.classList.remove('light', 'dark');
    body.classList.add(theme);
  }, [theme]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <p className="breadcrumbs">Home &gt; Dashboard V2</p>
        </div>
        <div className="header-center">
          <input type="text" placeholder="🔍 Search anything..." className="search-bar" />
        </div>
        <div className="header-right">
          <button className="header-btn" onClick={() => setIsModalOpen(true)}>Add Widget +</button>
          {/* The emoji has been replaced with an SVG icon for consistency */}
          <button className="icon-btn" onClick={resetLayout} title="Reset Layout">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
          </button>
          <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <div className="time-filter">Last 2 days ⌄</div>
        </div>
      </header>
      
      <div className="dashboard-title">
        <h1>CNAPP Dashboard</h1>
      </div>

      <main className="dashboard-main">
        {layout.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </main>

      {isModalOpen && (
        <AddWidgetModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default App;