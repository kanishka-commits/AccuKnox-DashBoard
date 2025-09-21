import React, { useState, useMemo, useEffect } from 'react';
import { useDashboardStore } from '../store';
import './AddWidgetModal.css';

const TABS = ['CSPM', 'CWPP', 'Image', 'Ticket'];

const AddWidgetModal = ({ categoryId, onClose }) => {
  // --- Data Selection ---
  const allWidgets = useDashboardStore((state) => state.allWidgets);
  const layout = useDashboardStore((state) => state.layout);
  const updateCategoryWidgets = useDashboardStore((state) => state.updateCategoryWidgets);
  
  // --- Local State ---
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // --- FIX #1: Correctly show ticked widgets ---
  // This useEffect hook runs when the modal opens.
  // It finds the correct category using the `categoryId` prop and sets the
  // checkboxes for widgets that are already on the dashboard.
  useEffect(() => {
    const currentCategory = layout.find((cat) => cat.id === categoryId);
    if (currentCategory) {
      setSelectedIds(new Set(currentCategory.widgets));
    }
  }, [categoryId, layout]);

  // Trigger the slide-in animation after the component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Handle closing the panel with animation
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300); // Wait for animation to finish
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

  // --- FIX #2: Make the "Confirm" button work correctly ---
  // The `updateCategoryWidgets` function now uses the correct `categoryId`
  // prop, ensuring it updates the category you actually opened the modal for.
  const handleConfirm = () => {
    updateCategoryWidgets(categoryId, Array.from(selectedIds));
    handleClose();
  };

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
                  />
                  {widget.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="modal-footer">
          <button onClick={handleClose} className="btn-cancel">Cancel</button>
          <button onClick={handleConfirm} className="btn-confirm">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default AddWidgetModal;