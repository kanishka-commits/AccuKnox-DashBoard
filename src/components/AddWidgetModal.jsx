import React, { useState, useMemo, useEffect } from 'react';
import { useDashboardStore } from '../store';
import { shallow } from 'zustand/shallow';
import './AddWidgetModal.css';

const TABS = ['CSPM', 'CWPP', 'Image', 'Ticket'];

const AddWidgetModal = ({ categoryId, onClose }) => {
  // Zustand subscriptions (split to avoid infinite loop)
  const allWidgets = useDashboardStore((state) => state.allWidgets, shallow);
  const layout = useDashboardStore((state) => state.layout, shallow);
  const updateCategoryWidgets = useDashboardStore((state) => state.updateCategoryWidgets);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const [newWidgetName, setNewWidgetName] = useState('');
  const [newWidgetCategory, setNewWidgetCategory] = useState(TABS[0]);


  // Sync selectedIds when modal opens or category/layout changes
  useEffect(() => {
    const currentCategory = layout.find((cat) => cat.id === categoryId);
    setSelectedIds(new Set(currentCategory?.widgets || []));
  }, [categoryId, layout]);

  // Filter widgets by tab + search
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
    updateCategoryWidgets(categoryId, Array.from(selectedIds));
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${true ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h2>Personalise your dashboard by adding the following widget</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="modal-body">
          {/* Tabs */}
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

          {/* Search */}
          <input
            type="text"
            placeholder="Search widgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          {/* Widget list */}
          <ul className="widget-list">
            {filteredWidgets.map((widget) => (
              <li key={widget.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(widget.id)}
                    onChange={() => handleSelectionChange(widget.id)}
                  />
                  {widget.name}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button onClick={handleConfirm} className="btn-confirm">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default AddWidgetModal;
