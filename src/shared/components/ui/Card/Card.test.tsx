import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';

describe('Card Component', () => {
  it('renders all subcomponents with appropriate structure and text', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>School Overview</CardTitle>
          <CardDescription>Academic Year 2026/2027</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main Card Body Content</p>
        </CardContent>
        <CardFooter>
          <span>Footer Actions</span>
        </CardFooter>
      </Card>
    );

    expect(
      screen.getByRole('heading', { name: 'School Overview' })
    ).toBeInTheDocument();
    expect(screen.getByText('Academic Year 2026/2027')).toBeInTheDocument();
    expect(screen.getByText('Main Card Body Content')).toBeInTheDocument();
    expect(screen.getByText('Footer Actions')).toBeInTheDocument();
  });

  it('applies hoverable styling when hoverable prop is set to true', () => {
    const { container } = render(<Card hoverable>Hoverable card</Card>);
    expect(container.firstChild).toHaveClass('hover:shadow-md');
  });
});
