import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

describe('Select Component', () => {
  const options = [
    { value: 'term1', label: 'Term 1' },
    { value: 'term2', label: 'Term 2' },
    { value: 'term3', label: 'Term 3', disabled: true },
  ];

  it('renders select with label and option elements', () => {
    render(<Select label="Academic Term" options={options} />);

    const select = screen.getByLabelText('Academic Term');
    expect(select).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getByRole('option', { name: 'Term 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Term 3' })).toBeDisabled();
  });

  it('handles user selection changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Select
        label="Select Term"
        options={options}
        defaultValue="term1"
        onChange={handleChange}
      />
    );

    const select = screen.getByLabelText('Select Term');
    expect(select).toHaveValue('term1');

    await user.selectOptions(select, 'term2');
    expect(select).toHaveValue('term2');
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders disabled state properly', () => {
    render(<Select label="Disabled Select" options={options} disabled />);
    expect(screen.getByLabelText('Disabled Select')).toBeDisabled();
  });

  it('renders error message and connects aria attributes', () => {
    render(
      <Select
        label="Required Select"
        options={options}
        error="Selection is required"
      />
    );

    const select = screen.getByLabelText('Required Select');
    expect(select).toHaveAttribute('aria-invalid', 'true');

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Selection is required');
  });
});
