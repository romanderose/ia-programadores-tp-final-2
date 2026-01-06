import { useTheme, ThemeMode } from '../contexts/ThemeContext';
import { Palette } from 'lucide-react';

export function ThemeSelector() {
  const { theme, setTheme, colors } = useTheme();

  const themes: { value: ThemeMode; label: string }[] = [
    { value: 'light1', label: 'Claro 1' },
    { value: 'light2', label: 'Claro 2' },
    { value: 'dark1', label: 'Oscuro 1' },
    { value: 'dark2', label: 'Oscuro 2' }
  ];

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Palette className={`w-4 h-4 ${colors.textSecondary}`} />
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as ThemeMode)}
          className={`${colors.inputBg} ${colors.text} ${colors.inputBorder} border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 cursor-pointer`}
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.25em 1.25em',
            paddingRight: '2rem'
          }}
        >
          {themes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
