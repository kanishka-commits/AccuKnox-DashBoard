import React from 'react';
import { useDashboardStore } from '../store';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import chartData from '../mockChartData.json';

// --- Chart components are unchanged, so they are omitted for brevity ---

// Define color palettes for both themes
const THEME_CHART_COLORS = {
  light: {
    // Pie chart specific colors (e.g., Connected/Not Connected)
    connected: "#4285F4", // Blue
    notConnected: "#BDC1C6", // Gray
    passed: "#4CAF50", // Green
    warning: "#FFC107", // Yellow
    failed: "#F44336", // Red

    // Bar chart specific colors (e.g., Critical/High/Medium/Low)
    critical: "#F44336",
    high: "#FF9800",
    medium: "#FFC107",
    low: "#4CAF50"
  },
  dark: {
    // Dark mode pie chart colors
    connected: "#63b3ed", // Lighter Blue
    notConnected: "#718096", // Darker Gray for contrast
    passed: "#68d391", // Lighter Green
    warning: "#faf089", // Lighter Yellow
    failed: "#f56565", // Lighter Red

    // Dark mode bar chart colors
    critical: "#f56565",
    high: "#f6ad55",
    medium: "#faf089",
    low: "#68d391"
  }
};

// Custom Tooltip component to use CSS variables
const CustomTooltip = ({ active, payload, label, theme }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'var(--card-background-color)',
        border: '1px solid var(--border-color)',
        padding: '10px',
        borderRadius: '5px',
        color: 'var(--text-color-secondary)',
        fontSize: '12px'
      }}>
        <p className="label">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Generic Chart Component for Pie Charts
const ThemedPieChart = ({ data, theme, innerRadius = 30 }) => {
  const colors = THEME_CHART_COLORS[theme];
  const finalData = data.map(item => ({
    ...item,
    color: item.name.includes('Connected') ? colors.connected :
           item.name.includes('Not Connected') ? colors.notConnected :
           item.name.includes('Passed') ? colors.passed :
           item.name.includes('Warning') ? colors.warning :
           item.name.includes('Failed') ? colors.failed :
           colors.connected // Fallback
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={finalData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={45} paddingAngle={2}>
          {finalData.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} />)}
        </Pie>
        <Tooltip content={<CustomTooltip theme={theme} />} />
        <Legend wrapperStyle={{ color: 'var(--text-color-secondary)', fontSize: '12px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Generic Chart Component for Bar Charts
const ThemedBarChart = ({ data, theme }) => {
    const colors = THEME_CHART_COLORS[theme];
    const finalData = {
        ...data,
        data: data.data.map(item => ({
            ...item,
            color: item.name.includes('Critical') ? colors.critical :
                   item.name.includes('High') ? colors.high :
                   item.name.includes('Medium') ? colors.medium :
                   item.name.includes('Low') ? colors.low :
                   colors.critical // Fallback
        }))
    };

    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p style={{ margin: 0, color: 'var(--text-color-tertiary)', marginBottom: '8px' }}>{data.total} Total</p>
        <ResponsiveContainer width="100%" height={50}>
          <BarChart data={finalData.data} layout="vertical" margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
            <XAxis type="number" hide />
            <Tooltip content={<CustomTooltip theme={theme} />} />
            <Bar dataKey="value" stackId="a" fill="#8884d8">
              {finalData.data.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
         <Legend wrapperStyle={{ color: 'var(--text-color-secondary)', fontSize: '12px', marginTop: '10px' }} />
      </div>
    );
};

const WIDGET_COMPONENTS = {
  cw1: (props) => <ThemedPieChart {...props} />,
  cw2: (props) => <ThemedPieChart {...props} innerRadius={0} />,
  cw5: (props) => <ThemedBarChart {...props} />,
  cw6: (props) => <ThemedBarChart {...props} />,
  cw7: (props) => <ThemedPieChart {...props} />,
};


const WidgetCard = ({ widget, categoryId }) => {
  const removeWidget = useDashboardStore((state) => state.removeWidget);
  const theme = useDashboardStore((state) => state.theme);

  const handleRemove = (e) => {
    e.stopPropagation();
    removeWidget(categoryId, widget.id);
  };

  const ChartComponent = WIDGET_COMPONENTS[widget.id];
  const dataForChart = chartData[widget.id];

  return (
    <div className="widget-card">
      <div className="widget-header">
        <h3>{widget.name}</h3>
        <div className="widget-controls">
          <button className="widget-btn" onClick={handleRemove} title="Remove Widget">
            {/* Trash Can Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
           <button className="widget-btn" title="More Options">
            {/* More Options (Kebab) Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/></svg>
          </button>
        </div>
      </div>
      <div className="widget-content">
        {ChartComponent && dataForChart ? (
          <ChartComponent data={dataForChart} theme={theme} />
        ) : (
          <div className="no-graph-data">
            {/* No Data Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            <p>No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetCard;