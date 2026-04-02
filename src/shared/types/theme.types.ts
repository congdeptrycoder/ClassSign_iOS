// Định nghĩa kiểu cho hệ thống Theme (Dark/Light Mode)

export type ThemeMode = 'light' | 'dark';

/**
 * Bảng màu cho từng element trong ứng dụng.
 * Mỗi màn hình sẽ nhận ThemeColors từ ThemeContext.
 */
export interface ThemeColors {
    // Nền chính
    background: string;
    // Nền thứ cấp (card, section)
    surface: string;
    // Nền navbar/header
    navBar: string;
    // Chữ chính
    text: string;
    // Chữ phụ (placeholder, hint)
    textSecondary: string;
    // Button chính (đỏ đậm / xanh đậm)
    buttonPrimary: string;
    // Chữ trên button chính
    buttonPrimaryText: string;
    // Button phụ (vàng)
    buttonSecondary: string;
    // Chữ trên button phụ
    buttonSecondaryText: string;
    // Nền header bảng
    tableHeader: string;
    // Màu viền bảng
    tableBorder: string;
    // Chữ header bảng
    tableHeaderText: string;
    // Chữ trong ô bảng
    tableCell: string;
    // Nền input
    inputBackground: string;
    // Chữ trong input
    inputText: string;
    // Viền input
    inputBorder: string;
    // Nền userInfo box (popup)
    card: string;
    // Chữ trong card
    cardText: string;
    // Màu icon/link
    link: string;
    // Màu viền/separator
    separator: string;
    // Màu nền section tìm kiếm
    searchSection: string;
    // Màu button tìm kiếm
    searchButton: string;
    // Button modal item hover
    modalBackground: string;
    // Gradient màn hình login (mảng 2 màu)
    loginGradient: [string, string];
    // Màu nút toggle theme
    themeToggleBackground: string;
    // Màu chữ nút toggle theme
    themeToggleText: string;
}

export interface ThemeContextValue {
    theme: ThemeMode;
    isDark: boolean;
    colors: ThemeColors;
    toggleTheme: () => void;
}
