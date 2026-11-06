import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import CountryPhoneInput from '../components/ui/CountryPhoneInput';
import CountryNationalityInput from '../components/ui/CountryNationalityInput';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, defaultValue) => (typeof defaultValue === 'string' ? defaultValue : key),
    i18n: { language: 'en', dir: () => 'ltr' },
  }),
}));

const PhoneHarness = ({ initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <div>
      <CountryPhoneInput
        id="phone"
        name="phone"
        value={value}
        onChange={setValue}
        placeholder="Phone number"
      />
      <output data-testid="phone-value">{value}</output>
    </div>
  );
};

const NationalityHarness = ({ initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <div>
      <CountryNationalityInput
        id="nationality"
        name="nationality"
        value={value}
        onChange={setValue}
      />
      <output data-testid="nationality-value">{value}</output>
    </div>
  );
};

describe('Country phone and nationality inputs', () => {
  it('shows the selected country code and parses an international phone value', () => {
    const { container } = render(<PhoneHarness initialValue="+201234567890" />);

    const input = container.querySelector('#phone');
    const trigger = screen.getByRole('button', { name: /country calling code/i });

    expect(input).toHaveValue('1234567890');
    expect(trigger).toHaveTextContent('+20');
    expect(trigger.querySelector('.fi-eg')).not.toBeNull();
  });

  it('preserves a pasted international phone value and updates the flag', () => {
    const { container } = render(<PhoneHarness />);

    fireEvent.change(container.querySelector('#phone'), {
      target: { value: '+1987654321' },
    });

    expect(screen.getByTestId('phone-value')).toHaveTextContent('+1987654321');
    expect(container.querySelector('.fi-us')).not.toBeNull();
  });

  it('selects a calling code from the searchable country list', () => {
    const { container } = render(<PhoneHarness initialValue="+201234567890" />);

    fireEvent.click(screen.getByRole('button', { name: /country calling code/i }));
    fireEvent.change(screen.getByPlaceholderText('Search country...'), {
      target: { value: 'United States' },
    });
    fireEvent.click(screen.getByRole('option', { name: /United States of America/ }));

    expect(screen.getByTestId('phone-value')).toHaveTextContent('+1 1234567890');
    expect(container.querySelector('.fi-us')).not.toBeNull();
  });

  it('maps common nationality text to a flag and supports selecting a country', () => {
    const { container } = render(<NationalityHarness initialValue="American" />);

    const input = container.querySelector('#nationality');
    expect(input).toHaveValue('American');
    expect(container.querySelector('.fi-us')).not.toBeNull();

    fireEvent.click(input);
    fireEvent.click(screen.getByRole('option', { name: /Egypt/ }));

    expect(screen.getByTestId('nationality-value')).toHaveTextContent('Egypt');
    expect(container.querySelector('.fi-eg')).not.toBeNull();
  });
});
