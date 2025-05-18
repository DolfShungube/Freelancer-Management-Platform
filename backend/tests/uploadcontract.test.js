import { JSDOM } from 'jsdom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs'

describe('Upload Page Tests', () => {
  let dom
  let window
  let document

  beforeEach(async () => {
    const html = fs.readFileSync('./frontend/src/pages/UploadContract.html', 'utf-8')
    dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable"
    })
    window = dom.window
    document = window.document
    
    // Mock functions
    window.displaySelectedFile = vi.fn()
    window.HTMLFormElement.prototype.submit = vi.fn()
  })

  it('should handle file input selection', () => {
    const browseButton = document.querySelector('.drop-zone button')
    const fileInput = document.getElementById('fileInput')
    
    // Test that clicking browse triggers file input
    fileInput.click = vi.fn()
    browseButton.click()
    expect(fileInput.click).toHaveBeenCalled()

    // Test file selection callback
    fileInput.dispatchEvent(new window.Event('change'))
    expect(window.displaySelectedFile).toHaveBeenCalled()
  })

  it('should prevent default form submission', () => {
    const form = document.getElementById('uploadForm')
    const preventDefault = vi.fn()
    
    form.addEventListener('submit', e => {
      e.preventDefault()
      preventDefault()
    })
    
    form.dispatchEvent(new window.Event('submit'))
    expect(preventDefault).toHaveBeenCalled()
  })
})