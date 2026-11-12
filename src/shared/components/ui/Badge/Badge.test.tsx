import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('renders with children text and default neutral variant', () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge.parentElement).toHaveClass('bg-slate-100');
  });

  it('renders all semantic variants with correct classes', () => {
    const { rerender } = render(<Badge variant="success">Active</Badge>);
    expect(screen.getByText('Active').parentElement).toHaveClass(
      'bg-emerald-50'
    );

    rerender(<Badge variant="warning">Late</Badge>);
    expect(screen.getByText('Late').parentElement).toHaveClass('bg-amber-50');

    rerender(<Badge variant="danger">Absent</Badge>);
    expect(screen.getByText('Absent').parentElement).toHaveClass('bg-rose-50');

    rerender(<Badge variant="info">Notice</Badge>);
    expect(screen.getByText('Notice').parentElement).toHaveClass('bg-sky-50');

    rerender(<Badge variant="protected">Medical SEN</Badge>);
    expect(screen.getByText('Medical SEN').parentElement).toHaveClass(
      'bg-violet-50'
    );
  });

  it('renders dot and icon indicators', () => {
    render(
      <Badge dot icon={<span data-testid="badge-icon">★</span>}>
        Featured
      </Badge>
    );

    expect(screen.getByText('Featured')).toBeInTheDocument();
    expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
  });
});
