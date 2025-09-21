import React, { useState, useMemo, useEffect } from 'react';
import { useDashboardStore } from '../store';
import './AddWidgetModal.css';

// Use the exact category names from your data file
const TABS = ['CSPM', 'CWPP', 'Registry Scan'];

const AddWidgetModal = ({ categoryId, onClose, initialTab }) => {
  const allWidgets = useDashboardStore((state) => state.allWidgets);
  const layout = useDashboardStore((state) => state.layout);
  const updateCategoryWidgets = useDashboardStore((state) => state.updateCategoryWidgets);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Use the `initialTab` prop to set the state.
  // Fallback to the first tab if it's not provided.
  const [activeTab, setActiveTab] = useState(initialTab || TABS[0]);

  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    if (categoryId) {
      const currentCategory = layout.find((cat) => cat.id === categoryId);
      if (currentCategory) {
        setSelectedIds(new Set(currentCategory.widgets));
      }
    }
  }, [categoryId, layout]);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  const filteredWidgets = useMemo(() => {
    return allWidgets.filter((widget) => {
      const inTab = widget.category === activeTab;
      const matchesSearch = widget.name.toLowerCase().includes(searchTerm.toLowerCase());
      return inTab && matchesSearch;
    });
  }, [allWidgets, activeTab, searchTerm]);

  const handleSelectionChange = (widgetId) => {
    setSelectedIds((prev) => {
      const newIds = new Set(prev);
      newIds.has(widgetId) ? newIds.delete(widgetId) : newIds.add(widgetId);
      return newIds;
    });
  };

  const handleConfirm = () => {
    if (categoryId) {
      // 1. Find the category key (e.g., "CSPM") for the section being edited.
      const currentCategory = layout.find(cat => cat.id === categoryId);
      if (!currentCategory) {
        handleClose();
        return;
      }
      const targetCategoryKey = currentCategory.categoryKey;

      // 2. Filter the selected IDs to only include widgets that belong to the target category.
      const validWidgetIds = Array.from(selectedIds).filter(id => {
        const widget = allWidgets.find(w => w.id === id);
        return widget && widget.category === targetCategoryKey;
      });

      // 3. Update the category with only the valid widgets.
      updateCategoryWidgets(categoryId, validWidgetIds);
    }
    handleClose();
  };


  const isGlobalMode = !categoryId;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className={`modal-content ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Personalise your dashboard</h2>
          <button onClick={handleClose} className="close-btn">×</button>
        </div>
        <div className="modal-body">
          <div className="tabs-container">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search widgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <ul className="widget-list">
            {filteredWidgets.map((widget) => (
              <li key={widget.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(widget.id)}
                    onChange={() => handleSelectionChange(widget.id)}
                    disabled={isGlobalMode}
                  />
                  {widget.name}
                </label>
              </li>
            ))}
            {isGlobalMode && (
              <p style={{textAlign: 'center', color: 'var(--text-color-tertiary)', marginTop: '20px'}}>
                To add widgets, please use the "+ Add Widget" button within a specific category on the dashboard.
              </p>
            )}
          </ul>
        </div>
        <div className="modal-footer">
          <button onClick={handleClose} className="btn-cancel">Cancel</button>
          <button
            onClick={handleConfirm}
            className="btn-confirm"
            disabled={isGlobalMode}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWidgetModal;