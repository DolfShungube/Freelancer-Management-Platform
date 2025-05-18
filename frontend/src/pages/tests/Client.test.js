import { describe, it, expect, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import '@testing-library/jest-dom'

describe('Client.html static DOM tests', () => {
  let container

  beforeEach(() => {
    // Adjust path to your Client.html location relative to this test file
    const htmlPath = path.resolve(__dirname, '../Client.html')
    const html = fs.readFileSync(htmlPath, 'utf-8')
    document.body.innerHTML = html
    container = document.body
  })

  it('renders the userName element', () => {
    const userName = container.querySelector('#userName')
    expect(userName).toBeInTheDocument()
    expect(userName).toHaveTextContent('UserName')
  })

  it('has a button with id addJob and text New job', () => {
    const addJobBtn = container.querySelector('#addJob')
    expect(addJobBtn).toBeInTheDocument()
    expect(addJobBtn).toHaveTextContent('New job')
  })

  it('renders the canvas element for the task donut chart', () => {
    const canvas = container.querySelector('#taskDonutChart')
    expect(canvas).toBeInTheDocument()
    expect(canvas.tagName).toBe('CANVAS')
  })

  it('includes the logout SVG button', () => {
    const logoutBtn = container.querySelector('#logout')
    expect(logoutBtn).toBeInTheDocument()
  })

  it('has a job list with multiple jobs', () => {
    const jobs = container.querySelectorAll('#joblist li')
    expect(jobs.length).toBeGreaterThan(0)
  })
})
