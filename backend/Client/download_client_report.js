function generatePDF(docElement) {
  html2pdf()
    .set({
      margin: 10,
      filename: 'Client_report.pdf',
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    })
    .from(docElement)
    .save();
}

document.getElementById("docButton_download_pdf").addEventListener("click", () => {
  const docElement = document.getElementById("client-report");
  generatePDF(docElement);
});
