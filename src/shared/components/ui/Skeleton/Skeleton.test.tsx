import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton Component', () => {
  it('renders with aria-hidden="true" for screen readers', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('renders variants and inline dimensions correctly', () => {
    const { container, rerender } = render(
      <Skeleton variant="circular" width={48} height={48} />
    );
    const circular = container.firstChild as HTMLElement;
    expect(circular).toHaveClass('rounded-full');
    expect(circular.style.width).toBe('48px');
    expect(circular.style.height).toBe('48px');

    rerender(<Skeleton variant="text" width="80%" />);
    const text = container.firstChild as HTMLElement;
    expect(text).toHaveClass('rounded');
    expect(text.style.width).toBe('80%');
  });
});
