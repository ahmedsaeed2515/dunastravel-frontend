import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { calculatePasswordStrength } from '../components/auth/PasswordStrengthMeter';
import LanguageSelector from '../components/ui/LanguageSelector';
import AuthModal from '../components/auth/AuthModal';
import { MemoryRouter } from 'react-router-dom';

// Partial mock for react-i18next preserving initReactI18next
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key, fallback) => (typeof fallback === 'string' ? fallback : key),
      i18n: {
        language: 'en',
        changeLanguage: vi.fn(),
        dir: () => 'ltr',
      },
    }),
  };
});

// Mock useActiveLocales
vi.mock('../hooks/useActiveLocales', () => ({
  useActiveLocales: () => ({
    activeLanguages: [
      { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
      { code: 'ar', label: 'العربية', flag: '🇪🇬', dir: 'rtl' },
      { code: 'es', label: 'Español', flag: '🇪🇸', dir: 'ltr' },
      { code: 'pt', label: 'Português', flag: '🇧🇷', dir: 'ltr' },
      { code: 'it', label: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
    ],
  }),
}));

// Mock useAuth
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn().mockResolvedValue({ id: 'u1' }),
    register: vi.fn().mockResolvedValue({ id: 'u2' }),
    resendVerification: vi.fn().mockResolvedValue({ message: 'sent' }),
  }),
}));

describe('Password Policy & Strength Calculation', () => {
  it('rejects passwords shorter than 12 characters', () => {
    const result = calculatePasswordStrength('Short1!Aa');
    expect(result.hasMinLength).toBe(false);
    expect(result.isValid).toBe(false);
  });

  it('rejects passwords without 3 character classes', () => {
    // 12 chars of lowercase only
    const result = calculatePasswordStrength('abcdefghijklm');
    expect(result.hasMinLength).toBe(true);
    expect(result.hasClasses).toBe(false);
    expect(result.isValid).toBe(false);
  });

  it('rejects predictable passwords containing blocked fragments', () => {
    const result = calculatePasswordStrength('AdminPassword123!Aa');
    expect(result.isPredictable).toBe(true);
    expect(result.isValid).toBe(false);
  });

  it('accepts compliant, strong passwords', () => {
    const result = calculatePasswordStrength('LuxTravel#2026Secure');
    expect(result.hasMinLength).toBe(true);
    expect(result.hasClasses).toBe(true);
    expect(result.isPredictable).toBe(false);
    expect(result.isValid).toBe(true);
    expect(result.score).toBe(4);
  });
});

describe('LanguageSelector Accessibility & Interaction', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with flag and language code trigger', () => {
    render(<LanguageSelector />);
    const button = screen.getByRole('button', { name: /select language/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('opens dropdown on click and displays all 5 language options', () => {
    render(<LanguageSelector />);
    const button = screen.getByRole('button', { name: /select language/i });
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(5);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('العربية')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('Português')).toBeInTheDocument();
    expect(screen.getByText('Italiano')).toBeInTheDocument();
  });

  it('closes on Escape key press', async () => {
    render(<LanguageSelector />);
    const button = screen.getByRole('button', { name: /select language/i });
    fireEvent.click(button);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('closes on outside click', async () => {
    render(
      <div>
        <div data-testid="outside">Outside area</div>
        <LanguageSelector />
      </div>
    );
    const button = screen.getByRole('button', { name: /select language/i });
    fireEvent.click(button);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });
});

describe('AuthModal Viewport & Tab Switching', () => {
  it('renders modal with dialog role and segmented tabs', () => {
    render(
      <MemoryRouter>
        <AuthModal isOpen={true} onClose={vi.fn()} initialTab="login" />
      </MemoryRouter>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('tablist')).toBeInTheDocument();

    const loginTab = screen.getByRole('tab', { name: /sign in/i });
    const registerTab = screen.getByRole('tab', { name: /register/i });
    expect(loginTab).toHaveAttribute('aria-selected', 'true');
    expect(registerTab).toHaveAttribute('aria-selected', 'false');
  });

  it('switches between Login and Register tabs', () => {
    render(
      <MemoryRouter>
        <AuthModal isOpen={true} onClose={vi.fn()} initialTab="login" />
      </MemoryRouter>
    );

    const registerTab = screen.getByRole('tab', { name: /register/i });
    fireEvent.click(registerTab);

    expect(registerTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });

  it('invokes onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <MemoryRouter>
        <AuthModal isOpen={true} onClose={handleClose} initialTab="login" />
      </MemoryRouter>
    );

    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});
