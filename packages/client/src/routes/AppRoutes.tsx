import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import DashboardRoute from './DashboardRoute';

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardRoute />} />
      {/* Outras rotas futuras aqui */}
    </Routes>
  </Router>
);

export default AppRoutes;
