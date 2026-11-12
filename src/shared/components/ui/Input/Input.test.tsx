import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders input with associated label and focuses on label click', async () => {
    const user = userEvent.setup();
    render(<Input label="Student Full Name" placeholder="e.g. John Doe" />);

    const label = screen.getByText('Student Full Name');
    const input = screen.getByLabelText('Student Full Name');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'e.g. John Doe');

    await user.click(label);
    expect(input).toHaveFocus();
  });

  it('captures user typing and triggers onChange', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Input label="Email" onChange={handleChange} />);
    const input = screen.getByLabelText('Email');

    await user.type(input, 'teacher@school.eu');
    expect(input).toHaveValue('teacher@school.eu');
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders error state and enforces accessibility attributes', () => {
    render(
      <Input
        label="Admission Number"
        error="Admission number already exists"
        helperText="Enter 8-character ID"
      />
    );

    const input = screen.getByLabelText(/admission number/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');

    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Admission number already exists');

    // aria-describedby includes the error id
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(describedBy).toContain(errorMessage.id);
  });

  it('renders helper text when there is no error', () => {
    render(
      <Input label="Password" helperText="Must be at least 8 characters" />
    );

    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('aria-invalid', 'false');

    const helper = screen.getByText('Must be at least 8 characters');
    expect(helper).toBeInTheDocument();
    expect(input.getAttribute('aria-describedby')).toBe(helper.id);
  });

  it('disables input when disabled prop is provided', () => {
    render(<Input label="Disabled Field" disabled />);
    expect(screen.getByLabelText('Disabled Field')).toBeDisabled();
  });
});
