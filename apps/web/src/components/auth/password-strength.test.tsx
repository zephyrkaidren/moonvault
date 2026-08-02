import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PasswordStrength } from './password-strength';

describe('PasswordStrength', () => {
  it('renders nothing when password is empty', () => {
    const { container } = render(<PasswordStrength password="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows "Too short" for a password under 8 characters', () => {
    render(<PasswordStrength password="abc123" />);
    expect(screen.getByText('Too short')).toBeInTheDocument();
  });

  it('shows a stronger label for a long, mixed-character password', () => {
    render(<PasswordStrength password="Str0ng!Password99" />);
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });
});