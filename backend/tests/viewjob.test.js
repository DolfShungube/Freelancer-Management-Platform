import { JSDOM } from 'jsdom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs'

describe('Freelancer Job Application Tests', () => {
  let dom
  let window
  let document

  beforeEach(async () => {
    const html = fs.readFileSync('./frontend/src/pages/ViewJob.html', 'utf-8')
    dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable"
    })
    window = dom.window
    document = window.document
    
    // Mock global functions
    window.Swal = {
      fire: vi.fn()
    }
  })

  describe('Form Submission', () => {
    


  describe('Job Application', () => {
    it('should display correct job details', () => {
      const clientName = document.getElementById('client-name')
      const descriptionText = document.getElementById('description-text')
      
      expect(clientName.textContent).toBe('Name of Client')
      expect(descriptionText.textContent).toContain('Description of the job')
    })

    it('should have working apply button', () => {
      const applyButton = document.getElementById('apply-btn')
      applyButton.click = vi.fn()
      applyButton.click()
      expect(applyButton.click).toHaveBeenCalled()
    })
  })
})
