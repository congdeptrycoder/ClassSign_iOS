/**
 * ThemeContext.tsx
 *
 * - Cung cấp ThemeProvider bọc toàn bộ ứng dụng (Observer Pattern).
 * - Export useTheme() hook để các màn hình subscribe vào theme hiện tại.
 * - Bảng màu lightColors / darkColors được định nghĩa tại đây.
 *
 * Design Patterns:
 *   - Observer: React Context tự động notify tất cả subscriber khi theme thay đổi.
 *   - Strategy: Mỗi màn hình chọn chiến lược tạo styles dựa trên colors nhận được.
 */

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ThemeColors, ThemeContextValue, ThemeMode } from '../../shared/types/theme.types';

// ─── Bảng màu Light Mode ───────────────────────────────────────────────────────
export const lightColors: ThemeColors = {
    background: '#FFFFFF',
    surface: '#F8F8F8',
    navBar: '#CC0000',
    text: '#333333',
    textSecondary: '#666666',
    buttonPrimary: '#8B0000',
    buttonPrimaryText: '#FFFFFF',
    buttonSecondary: '#FFD700',
    buttonSecondaryText: '#8B0000',
    tableHeader: '#F0F0F0',
    tableBorder: '#EEEEEE',
    tableHeaderText: '#555555',
    tableCell: '#333333',
    inputBackground: 'rgba(255, 255, 255, 0.9)',
    inputText: '#333333',
    inputBorder: '#DDDDDD',
    card: '#FFFFFF',
    cardText: '#333333',
    link: '#0275d8',
    separator: '#EEEEEE',
    searchSection: '#F9F9F9',
    searchButton: '#8B0000',
    modalBackground: '#FFFFFF',
    loginGradient: ['#8B0000', '#FF4D4D'],
    themeToggleBackground: 'rgba(255,255,255,0.25)',
    themeToggleText: '#FFFFFF',
};

// ─── Bảng màu Dark Mode ────────────────────────────────────────────────────────
export const darkColors: ThemeColors = {
    background: '#1a1a2e',
    surface: '#16213e',
    navBar: '#0f3460',
    text: '#E0E0E0',
    textSecondary: '#AAAAAA',
    buttonPrimary: '#e94560',
    buttonPrimaryText: '#FFFFFF',
    buttonSecondary: '#f5a623',
    buttonSecondaryText: '#1a1a2e',
    tableHeader: '#1a2a4a',
    tableBorder: '#2a3a5a',
    tableHeaderText: '#CCCCCC',
    tableCell: '#E0E0E0',
    inputBackground: 'rgba(255, 255, 255, 0.08)',
    inputText: '#E0E0E0',
    inputBorder: '#2a3a5a',
    card: '#16213e',
    cardText: '#E0E0E0',
    link: '#64B5F6',
    separator: '#2a3a5a',
    searchSection: '#16213e',
    searchButton: '#e94560',
    modalBackground: '#1a2a4a',
    loginGradient: ['#1a1a2e', '#0f3460'],
    themeToggleBackground: 'rgba(255,255,255,0.15)',
    themeToggleText: '#FFD700',
};

// ─── Context ───────────────────────────────────────────────────────────────────
const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────
interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<ThemeMode>('light');

    const toggleTheme = useCallback(() => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    }, []);

    // Memo hoá để tránh re-render không cần thiết
    const value = useMemo<ThemeContextValue>(() => {
        const isDark = theme === 'dark';
        return {
            theme,
            isDark,
            colors: isDark ? darkColors : lightColors,
            toggleTheme,
        };
    }, [theme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// ─── Custom Hook ───────────────────────────────────────────────────────────────
/**
 * useTheme() — hook để các component subscribe vào theme hiện tại.
 * Ném lỗi nếu dùng ngoài ThemeProvider để tránh bug khó debug.
 */
export const useTheme = (): ThemeContextValue => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
