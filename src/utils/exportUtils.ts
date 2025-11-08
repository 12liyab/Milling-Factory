import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { SalesRecord } from '../types';

export function exportToPDF(records: SalesRecord[], title: string = 'Sales Records') {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text(title, 14, 20);

  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  doc.text(`Total Records: ${records.length}`, 14, 36);

  const totalSales = records.reduce((sum, r) => sum + r.totalAmount, 0);
  doc.text(`Total Sales: $${totalSales.toFixed(2)}`, 14, 42);

  const tableData = records.map((record) => [
    record.date,
    record.clientName,
    record.phoneNumber || 'N/A',
    record.machineType,
    record.quantity.toFixed(2),
    `$${record.pricePerUnit.toFixed(2)}`,
    `$${record.totalAmount.toFixed(2)}`,
    record.paymentType,
    record.notes || ''
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['Date', 'Client', 'Phone', 'Machine', 'Qty', 'Price/Unit', 'Total', 'Payment', 'Notes']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [249, 115, 22] },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 25 },
      2: { cellWidth: 22 },
      3: { cellWidth: 20 },
      4: { cellWidth: 15 },
      5: { cellWidth: 18 },
      6: { cellWidth: 18 },
      7: { cellWidth: 20 },
      8: { cellWidth: 25 }
    }
  });

  doc.save(`sales-records-${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportToExcel(records: SalesRecord[], filename: string = 'sales-records') {
  const data = records.map((record) => ({
    Date: record.date,
    'Client Name': record.clientName,
    'Phone Number': record.phoneNumber || '',
    'Machine Type': record.machineType,
    Quantity: record.quantity,
    'Price per Unit': record.pricePerUnit,
    'Total Amount': record.totalAmount,
    'Payment Type': record.paymentType,
    Notes: record.notes || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const colWidths = [
    { wch: 12 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 10 },
    { wch: 12 },
    { wch: 12 },
    { wch: 15 },
    { wch: 30 }
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Records');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  saveAs(dataBlob, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportToCSV(records: SalesRecord[], filename: string = 'sales-records') {
  const headers = ['Date', 'Client Name', 'Phone Number', 'Machine Type', 'Quantity', 'Price per Unit', 'Total Amount', 'Payment Type', 'Notes'];

  const csvData = records.map((record) => [
    record.date,
    record.clientName,
    record.phoneNumber || '',
    record.machineType,
    record.quantity,
    record.pricePerUnit,
    record.totalAmount,
    record.paymentType,
    record.notes || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
}

export function printRecords(records: SalesRecord[]) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const totalSales = records.reduce((sum, r) => sum + r.totalAmount, 0);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Sales Records</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header img {
            width: 60px;
            height: 60px;
            margin-bottom: 10px;
          }
          .header h1 {
            margin: 10px 0;
            color: #f97316;
          }
          .summary {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #fff7ed;
            border-left: 4px solid #f97316;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-size: 12px;
          }
          th {
            background-color: #f97316;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="/thenovus.solutions_Puzzle-icon.png" alt="Logo" />
          <h1>Milling Factory Sales Records</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
        <div class="summary">
          <p><strong>Total Records:</strong> ${records.length}</p>
          <p><strong>Total Sales:</strong> $${totalSales.toFixed(2)}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Client</th>
              <th>Phone</th>
              <th>Machine</th>
              <th>Qty</th>
              <th>Price/Unit</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${records.map(record => `
              <tr>
                <td>${record.date}</td>
                <td>${record.clientName}</td>
                <td>${record.phoneNumber || 'N/A'}</td>
                <td>${record.machineType}</td>
                <td>${record.quantity.toFixed(2)}</td>
                <td>$${record.pricePerUnit.toFixed(2)}</td>
                <td>$${record.totalAmount.toFixed(2)}</td>
                <td>${record.paymentType}</td>
                <td>${record.notes || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 250);
}
