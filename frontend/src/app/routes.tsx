import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { Dashboard } from '../pages/Dashboard';
import { Resources } from '../pages/Resources';
import { DataQuality } from '../pages/DataQuality';
import { Scenario } from '../pages/Scenario';
import { Plan } from '../pages/Plan';
import { Compare } from '../pages/Compare';
import { Review } from '../pages/Review';
import { Audit } from '../pages/Audit';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="resources" element={<Resources />} />
        <Route path="data-quality" element={<DataQuality />} />
        <Route path="scenario" element={<Scenario />} />
        <Route path="plan" element={<Plan />} />
        <Route path="compare" element={<Compare />} />
        <Route path="review" element={<Review />} />
        <Route path="audit" element={<Audit />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
