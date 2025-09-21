import React, {useState} from 'react';
import { useDashboardStore } from './store';
import CategorySection from './components/CategorySection';
import AddWidgetModal from './components/AddWidgetModal'; // Assuming this is your modal component
import './App.css';

function App() {
  // Get new state and actions from the store
  const layout = useDashboardStore((state) => state.layout);
  const theme = useDashboardStore((state) => state.theme);
  const toggleTheme = useDashboardStore((state) => state.toggleTheme);
  const resetLayout = useDashboardStore((state) => state.resetLayout);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // The main container now gets a class of 'light' or 'dark'
  return (
    <div className={`app-container ${theme}`}>
      <header className="app-header">
        <div className="header-left">
          <p className="breadcrumbs">Home &gt; Dashboard V2</p>
        </div>
        <div className="header-center">
          <input type="text" placeholder="🔍 Search anything..." className="search-bar" />
        </div>
        <div className="header-right">
          <button className="header-btn" onClick={() => setIsModalOpen(true)}>Add Widget +</button>
          {/* Reset button is now functional */}
          <button className="icon-btn" onClick={resetLayout} title="Reset Layout">🔄</button>
          {/* New theme toggle button */}
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