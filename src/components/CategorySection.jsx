import React, { useState } from 'react';
import { useDashboardStore } from '../store';
import WidgetCard from './WidgetCard';
import AddWidgetModal from './AddWidgetModal';

const CategorySection = ({ category }) => {
  const { title, widgets: widgetIds, id: categoryId, categoryKey } = category;
  const allWidgets = useDashboardStore((state) => state.allWidgets);
  const [isModalOpen, setModalOpen] = useState(false);

  const widgets = widgetIds.map(id => allWidgets.find(w => w.id === id)).filter(Boolean);

  // A single, consistent layout for ALL categories.
  return (
    <div className="category-section">
      <div className="category-header">
        <h2>{title}</h2>
      </div>
      <div className="widgets-container">
        {widgets.map((widget) => (
          <WidgetCard key={widget.id} widget={widget} categoryId={categoryId} />
        ))}
        <div className="widget-card add-widget-card" onClick={() => setModalOpen(true)}>
          <div className="add-widget-content">
            + Add Widget
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AddWidgetModal
          categoryId={categoryId}
          onClose={() => setModalOpen(false)}
          initialTab={categoryKey}
        />
      )}
    </div>
  );
};

export default CategorySection;