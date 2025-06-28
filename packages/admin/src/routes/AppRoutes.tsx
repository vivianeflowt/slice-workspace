import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { TaskManager } from '../pages/TaskManager';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/tasks" element={<TaskManager />} />
  </Routes>
);

export default AppRoutes;
