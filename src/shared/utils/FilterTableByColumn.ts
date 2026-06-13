/**
 * Hàm tiện ích chung để lọc một mảng các đối tượng dựa trên điều kiện của từng cột.
 * Sử dụng so sánh chuỗi (không phân biệt chữ hoa/thường)
 * 
 * @param data Mảng dữ liệu đầu vào cần lọc
 * @param filters Object chứa các khoá cần lọc và giá trị lọc tương ứng
 * @returns Mảng đã được lọc
 */
export const FilterTableByColumn = <T extends Record<string, any>>(
    data: T[],
    filters: Partial<Record<keyof T, string>>
): T[] => {
    return data.filter(item => {
        // Kiểm tra xem phần tử có thoả mãn tất cả các điều kiện lọc (AND) hay không
        return Object.entries(filters).every(([key, filterValue]) => {
            // Nếu không có giá trị filter cho cột này, bỏ qua (coi như thoả mãn)
            if (!filterValue) return true;

            const itemValue = item[key];
            
            // Nếu data không có trường này hoặc null/undefined thì không khớp
            if (itemValue === null || itemValue === undefined) return false;

            // So sánh chuỗi con, không phân biệt hoa thường
            return itemValue
                .toString()
                .toLowerCase()
                .includes(filterValue.toString().toLowerCase());
        });
    });
};
