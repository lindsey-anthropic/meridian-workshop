// Minimal CSV helpers — escape values, build a CSV string, trigger a browser download.

const escapeCell = (value) => {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export const toCSV = (headerRow, dataRows) => {
  const lines = [headerRow.map(escapeCell).join(',')]
  for (const row of dataRows) {
    lines.push(row.map(escapeCell).join(','))
  }
  return lines.join('\n')
}

export const downloadCSV = (filename, csvString) => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
