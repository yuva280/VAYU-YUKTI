import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from '../app/App';

describe('VAYU-YUKTI Frontend Shell (FE-1, FE-2, FE-3)', () => {
  it('renders the mandatory permanent synthetic/advisory banner', () => {
    render(<App />);
    const banner = screen.getByText(/Synthetic data · advisory only · not connected to any real system/i);
    expect(banner).toBeInTheDocument();
  });

  it('renders the application branding and operational planning subtitle', () => {
    render(<App />);
    expect(screen.getByText(/VAYU-YUKTI/i)).toBeInTheDocument();
    expect(screen.getByText(/Air Operations Planning/i)).toBeInTheDocument();
  });

  it('renders demo-only role switcher with Planner and Reviewer options', () => {
    render(<App />);
    expect(screen.getByText(/^Planner$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Reviewer$/i)).toBeInTheDocument();
  });

  it('renders navigation links for all required screens', () => {
    render(<App />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Resources & Crew')).toBeInTheDocument();
    expect(screen.getByText('Data Quality')).toBeInTheDocument();
    expect(screen.getByText('Scenario & Changes')).toBeInTheDocument();
    expect(screen.getByText('Plan Timeline')).toBeInTheDocument();
    expect(screen.getByText('Compare & Diff')).toBeInTheDocument();
    expect(screen.getByText('Review & Sign-Off')).toBeInTheDocument();
    expect(screen.getByText('Audit & History')).toBeInTheDocument();
  });
});
