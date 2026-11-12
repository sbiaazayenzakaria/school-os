import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast } from './index';
import { Button } from '../Button';

const TestToastConsumer = () => {
  const { success, error, warning, info } = useToast();

  return (
    <div>
      <Button
        onClick={() =>
          success('Success Title', {
            message: 'Operation succeeded',
            duration: 3000,
          })
        }
      >
        Trigger Success
      </Button>
      <Button
        onClick={() =>
          error('Error Title', {
            message: 'Something went wrong',
            duration: 3000,
          })
        }
      >
        Trigger Error
      </Button>
      <Button
        onClick={() =>
          warning('Warning Title', {
            message: 'Caution advised',
            duration: 3000,
          })
        }
      >
        Trigger Warning
      </Button>
      <Button
        onClick={() =>
          info('Info Title', { message: 'Informational note', duration: 3000 })
        }
      >
        Trigger Info
      </Button>
    </div>
  );
};

describe('Toast Component & Provider', () => {
  it('renders success toast with title, message, and accessibility attributes', () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    const triggerBtn = screen.getByRole('button', { name: /trigger success/i });
    fireEvent.click(triggerBtn);

    const toastElement = screen.getByRole('status');
    expect(toastElement).toBeInTheDocument();
    expect(toastElement).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Success Title')).toBeInTheDocument();
    expect(screen.getByText('Operation succeeded')).toBeInTheDocument();
  });

  it('renders different notification variants (error, warning, info)', () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /trigger error/i }));
    fireEvent.click(screen.getByRole('button', { name: /trigger warning/i }));
    fireEvent.click(screen.getByRole('button', { name: /trigger info/i }));

    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Warning Title')).toBeInTheDocument();
    expect(screen.getByText('Info Title')).toBeInTheDocument();
  });

  it('allows manual dismiss of toast by clicking close button', () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /trigger success/i }));
    expect(screen.getByText('Success Title')).toBeInTheDocument();

    const dismissBtn = screen.getByRole('button', {
      name: /dismiss notification/i,
    });
    fireEvent.click(dismissBtn);

    expect(screen.queryByText('Success Title')).not.toBeInTheDocument();
  });

  it('automatically dismisses toast after configured duration using fake timers', () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /trigger success/i }));
    expect(screen.getByText('Success Title')).toBeInTheDocument();

    // Advance timers by the toast duration (3000ms)
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('Success Title')).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
