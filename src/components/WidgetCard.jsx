import React from 'react';
import { useDashboardStore } from '../store';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import chartData from '../mockChartData.json';

// --- Chart Component for simple Pie Charts (cw1, cw7) ---
const SimplePieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={40} paddingAngle={5}>
        {data.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} />)}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

// --- Chart Component for detailed Pie Charts (cw2) ---
const DetailedPieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50}>
        {data.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} />)}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

// --- Chart Component for Image Vulnerabilities (cw5, cw6) ---
const ImageVulnerabilityChart = ({ data }) => (
  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <p style={{ margin: 0, color: '#666' }}>{data.total} Total Images/Vulnerabilities</p>
    <ResponsiveContainer width="100%" height={50}>
      <BarChart data={data.data} layout="vertical" margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
        <XAxis type="number" hide />
        <Tooltip />
        <Bar dataKey="value" stackId="a" fill="#8884d8">
          {data.data.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// --- A mapping from widget ID to its corresponding chart component ---
const WIDGET_COMPONENTS = {
  cw1: SimplePieChart,
  cw2: DetailedPieChart,
  cw5: ImageVulnerabilityChart,
  cw6: ImageVulnerabilityChart,
  cw7: SimplePieChart,
};

const WidgetCard = ({ widget, categoryId }) => {
  const removeWidget = useDashboardStore((state) => state.removeWidget);

  const handleRemove = (e) => {
    e.stopPropagation();
    removeWidget(categoryId, widget.id);
  };

  // Dynamically select the correct chart component based on the widget's ID
  const ChartComponent = WIDGET_COMPONENTS[widget.id];
  const dataForChart = chartData[widget.id];

  return (
    <div className="widget-card">
      <button className="remove-btn" onClick={handleRemove}>×</button>
      <div className="widget-header">
        <h3>{widget.name}</h3>
      </div>
      <div className="widget-content">
        {ChartComponent && dataForChart ? (
          <ChartComponent data={dataForChart} />
        ) : (
          <div className="no-graph-data">No Graph data available!</div>
        )}
      </div>
    </div>
  );
};

export default WidgetCard;