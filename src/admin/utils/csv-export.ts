// CSV export helper — Excel-friendly (UTF-8 BOM, ; separator) with
// CSV-injection protection (cells starting with =, +, -, @ get prefixed
// with a single quote so Excel/Numbers don't evaluate them as formulas).

export type CsvCell = string | number | null | undefined;
export type CsvRow = CsvCell[];

const FORMULA_TRIGGERS = ['=', '+', '-', '@', '\t', '\r'];

function escapeCell(value: CsvCell): string {
    if (value === null || value === undefined) return '';
    let s = String(value);
    // CSV injection guard — neutralize formulas
    if (s.length > 0 && FORMULA_TRIGGERS.includes(s[0])) {
        s = "'" + s;
    }
    // Escape quotes by doubling them and wrap if needed
    if (s.includes('"') || s.includes(';') || s.includes('\n') || s.includes('\r')) {
        s = '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
}

export function buildCsv(headers: string[], rows: CsvRow[]): string {
    const lines: string[] = [];
    lines.push(headers.map(escapeCell).join(';'));
    for (const row of rows) {
        lines.push(row.map(escapeCell).join(';'));
    }
    // BOM + CRLF for Excel compatibility on Windows
    return '\uFEFF' + lines.join('\r\n');
}

export function downloadCsv(filename: string, headers: string[], rows: CsvRow[]) {
    const csv = buildCsv(headers, rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Format a number as French-style decimal (1234.56 → "1234,56")
export function formatPriceFr(value: number): string {
    if (!Number.isFinite(value)) return '';
    return value.toFixed(2).replace('.', ',');
}
