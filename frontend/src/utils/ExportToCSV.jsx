export const exportToCSV = (filename, columns, data) => {
  // Create CSV header from column names
  const headers = columns.map(col => col.name).join(",");

  // Create CSV body rows
  const rows = data.map((row, index) => {
    return columns.map(col => {
      if (col.selector) {
        const value = col.selector({ ...row, sno: index + 1 });
        // Handle if it's a React element (like <img> or <a>)
        return typeof value === 'string' || typeof value === 'number'
          ? `"${value}"`
          : `"${typeof value === 'object' ? '[object]' : value}"`;
      }
      return "";
    }).join(",");
  });

  // Combine header and rows
  const csv = [headers, ...rows].join("\n");

  // Create and trigger CSV file download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
