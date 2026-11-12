import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable, Column } from './DataTable';

interface StudentRow {
  id: string;
  name: string;
  grade: string;
  status: 'active' | 'suspended';
}

const mockStudents: StudentRow[] = [
  { id: 'STU-1', name: 'Alice Smith', grade: 'Grade 10', status: 'active' },
  { id: 'STU-2', name: 'Bob Jones', grade: 'Grade 11', status: 'suspended' },
];

const columns: Column<StudentRow>[] = [
  { key: 'id', header: 'Student ID' },
  { key: 'name', header: 'Full Name' },
  { key: 'grade', header: 'Grade' },
  {
    key: 'status',
    header: 'Status',
    render: item => (
      <span data-testid={`status-${item.id}`}>{item.status.toUpperCase()}</span>
    ),
  },
];

describe('DataTable Component', () => {
  it('renders table headers and row cells correctly', () => {
    render(
      <DataTable
        columns={columns}
        data={mockStudents}
        keyExtractor={item => item.id}
      />
    );

    // Headers
    expect(
      screen.getByRole('columnheader', { name: 'Student ID' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Full Name' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Grade' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Status' })
    ).toBeInTheDocument();

    // Data rows
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    expect(screen.getByText('Grade 10')).toBeInTheDocument();
  });

  it('supports custom cell rendering', () => {
    render(
      <DataTable
        columns={columns}
        data={mockStudents}
        keyExtractor={item => item.id}
      />
    );

    const customStatus1 = screen.getByTestId('status-STU-1');
    const customStatus2 = screen.getByTestId('status-STU-2');

    expect(customStatus1).toHaveTextContent('ACTIVE');
    expect(customStatus2).toHaveTextContent('SUSPENDED');
  });

  it('renders loading state with skeleton placeholders', () => {
    render(
      <DataTable
        columns={columns}
        data={mockStudents}
        keyExtractor={item => item.id}
        isLoading={true}
        loadingRowCount={3}
      />
    );

    // When loading, data rows are not rendered
    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
  });

  it('renders empty state when data array is empty', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        keyExtractor={item => item.id}
        emptyState={{
          title: 'No Students Enrolled',
          description: 'Add students to populate this directory.',
        }}
      />
    );

    expect(screen.getByText('No Students Enrolled')).toBeInTheDocument();
    expect(
      screen.getByText('Add students to populate this directory.')
    ).toBeInTheDocument();
  });

  it('renders error state when error prop is provided', () => {
    render(
      <DataTable
        columns={columns}
        data={mockStudents}
        keyExtractor={item => item.id}
        error="Network timeout connecting to server"
      />
    );

    expect(
      screen.getByText('Failed to load table records')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Network timeout connecting to server')
    ).toBeInTheDocument();
  });

  it('handles row click interaction when onRowClick is provided', async () => {
    const handleRowClick = vi.fn();
    const user = userEvent.setup();

    render(
      <DataTable
        columns={columns}
        data={mockStudents}
        keyExtractor={item => item.id}
        onRowClick={handleRowClick}
      />
    );

    const rowCell = screen.getByText('Alice Smith');
    await user.click(rowCell);

    expect(handleRowClick).toHaveBeenCalledTimes(1);
    expect(handleRowClick).toHaveBeenCalledWith(mockStudents[0]);
  });
});
