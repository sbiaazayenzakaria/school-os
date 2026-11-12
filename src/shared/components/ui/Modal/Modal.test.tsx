import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../Button';

const TestModalHarness = ({
  initialOpen = false,
}: {
  initialOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div>
      <button data-testid="trigger-btn" onClick={() => setIsOpen(true)}>
        Open Modal
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Test Modal Title"
        description="Test Modal Description"
      >
        <p>Modal body content</p>
        <Button onClick={() => setIsOpen(false)}>Done</Button>
      </Modal>
    </div>
  );
};

describe('Modal Component', () => {
  it('does not render when isOpen is false', () => {
    render(<TestModalHarness initialOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders with dialog semantics, title, and description when isOpen is true', () => {
    render(<TestModalHarness initialOpen={true} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    expect(
      screen.getByRole('heading', { name: /test modal title/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Test Modal Description')).toBeInTheDocument();
    expect(screen.getByText('Modal body content')).toBeInTheDocument();
  });

  it('closes when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<TestModalHarness initialOpen={true} />);

    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    await user.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<TestModalHarness initialOpen={true} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('manages and restores focus to previous active element upon close', async () => {
    const user = userEvent.setup();
    render(<TestModalHarness initialOpen={false} />);

    const triggerBtn = screen.getByTestId('trigger-btn');
    triggerBtn.focus();
    expect(triggerBtn).toHaveFocus();

    await user.click(triggerBtn);

    // Focus moves inside modal
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close modal via Escape
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(triggerBtn).toHaveFocus();
    });
  });

  it('locks body scroll when opened and restores it when closed', async () => {
    const user = userEvent.setup();
    render(<TestModalHarness initialOpen={false} />);

    expect(document.body.style.overflow).not.toBe('hidden');

    const triggerBtn = screen.getByTestId('trigger-btn');
    await user.click(triggerBtn);

    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
