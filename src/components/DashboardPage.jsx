import React from 'react';
import { useDashboardStore } from './store';
import CategorySection from './CategorySection';

const DashboardPage = () => {
  const layout = useDashboardStore((state) => state.layout);

  return (
    <div className="dashboard">
      <h1>CNAPP Dashboard</h1> {/* [cite: 4] */}
      {layout.map((category) => (
        <CategorySection key={category.id} category={category} />
      ))}
    </div>
  );
};

export default DashboardPage;