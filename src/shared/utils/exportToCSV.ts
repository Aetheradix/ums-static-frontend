export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) return;

  const keys = Object.keys(data[0]);

  const csvContent = [
    keys.join(','),
    ...data.map(row =>
      keys
        .map(key => {
          let val = row[key];
          if (val === null || val === undefined) val = '';
          if (typeof val === 'string') {
            val = val.replace(/"/g, '""');
            if (val.search(/("|,|\n)/g) >= 0) {
              val = `"${val}"`;
            }
          }
          return val;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
