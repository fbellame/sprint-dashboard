import { describe, it, expect } from 'vitest';
import { render, screen } from '@/lib/test-utils';
import { Button } from './Button';

describe('Button', () => {
  it('renders button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders with primary variant by default', () => {
    const { container } = render(<Button>Primary Button</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-primary');
  });

  it('renders with secondary variant', () => {
    const { container } = render(
      <Button variant="secondary">Secondary Button</Button>
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-gray-200');
  });

  it('renders with outline variant', () => {
    const { container } = render(
      <Button variant="outline">Outline Button</Button>
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('border-2', 'border-primary');
  });

  it('renders with different sizes', () => {
    const { container: smContainer } = render(<Button size="sm">Small</Button>);
    expect(smContainer.querySelector('button')).toHaveClass('px-3', 'py-1.5');

    const { container: mdContainer } = render(
      <Button size="md">Medium</Button>
    );
    expect(mdContainer.querySelector('button')).toHaveClass('px-4', 'py-2');

    const { container: lgContainer } = render(<Button size="lg">Large</Button>);
    expect(lgContainer.querySelector('button')).toHaveClass('px-6', 'py-3');
  });

  it('handles disabled state', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Button className="custom-class">Custom</Button>
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('custom-class');
  });

  it('passes through HTML button attributes', () => {
    render(
      <Button type="submit" aria-label="Submit form">
        Submit
      </Button>
    );
    const button = screen.getByLabelText('Submit form');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
