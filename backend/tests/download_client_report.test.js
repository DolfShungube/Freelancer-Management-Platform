import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the html2pdf global function
const saveMock = vi.fn();
const fromMock = vi.fn(() => ({
  save: saveMock
}));
const html2pdfMock = vi.fn(() => ({
  set: vi.fn().mockReturnValue({
    from: fromMock
  })
}));

// Inject html2pdf into the global scope
global.html2pdf = html2pdfMock;

describe('generatePDF', () => {
  let docElement;

  beforeEach(() => {
    // Clear previous calls
    vi.clearAllMocks();

    // Setup DOM
    document.body.innerHTML = `
      <div id="client-report">Client Report Content</div>
      <button id="docButton_download_pdf">Download</button>
    `;

    // Import the script AFTER DOM setup
    // This will bind the click listener
    require('../Client/download_client_report.js'); // update path accordingly

    docElement = document.getElementById('client-report');
  });

  it('calls html2pdf with correct element on button click', () => {
    const button = document.getElementById('docButton_download_pdf');
    button.click();

    expect(html2pdfMock).toHaveBeenCalled();
    expect(fromMock).toHaveBeenCalledWith(docElement);
    expect(saveMock).toHaveBeenCalled();
  });
});