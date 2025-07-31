import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import styles from './Proyectos.module.css';

interface ChartDataItem {
  name: string;
  value: number;
}

interface ProjectChartsProps {
  typeData: ChartDataItem[];
  languageData: ChartDataItem[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#4CAF50', '#FF5733', '#33FF57', '#3357FF']; // Más colores

const ProjectCharts: React.FC<ProjectChartsProps> = ({ typeData, languageData }) => {
  const renderChart = (data: ChartDataItem[], title: string) => {
    if (!data || data.length === 0) {
      return (
        <div className={styles['chart-single-container']}>
          <h3>{title}</h3>
          <p>No hay datos disponibles para este gráfico.</p>
        </div>
      );
    }

    return (
      <div className={styles['chart-single-container']}>
        <h3>{title}</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }: { name?: string; percent?: number }) => `${name || 'N/A'} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className={styles['charts-container']}>
      <h2>Estadísticas de Proyectos</h2>
      <div className={styles['charts-grid']}>
        {renderChart(typeData, 'Proyectos por Tipo')}
        {renderChart(languageData, 'Proyectos por Lenguaje')}
      </div>
    </div>
  );
};

export default ProjectCharts;
