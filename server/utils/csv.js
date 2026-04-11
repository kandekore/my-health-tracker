function escape(v) {
  if (v == null) return '';
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(rows, columns) {
  const header = columns.map((c) => c.label).join(',');
  const body = rows
    .map((r) => columns.map((c) => escape(typeof c.get === 'function' ? c.get(r) : r[c.key])).join(','))
    .join('\n');
  return `${header}\n${body}\n`;
}

module.exports = { toCsv };
