import { describe, it, expect, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import '@testing-library/jest-dom'

describe('Freelancio Chat UI - Static DOM Tests', () => {
  let container

  beforeEach(() => {
    // Load the chat HTML page
    const filePath = path.resolve(__dirname, '../chatbox.html') // Adjust path if needed
    const html = fs.readFileSync(filePath, 'utf-8')
    document.body.innerHTML = html
    container = document.body
  })

  it('renders the header with title and status', () => {
    const header = container.querySelector('header')
    expect(header).toBeInTheDocument()

    const title = header.querySelector('h1')
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent('Freelancio')

    const status = header.querySelector('small')
    expect(status).toBeInTheDocument()
    expect(status).toHaveTextContent('Online')
  })

  it('renders the chat message container', () => {
    const main = container.querySelector('main#chatbox')
    expect(main).toBeInTheDocument()
  })

  it('renders the message input and send button in footer', () => {
    const footer = container.querySelector('footer')
    expect(footer).toBeInTheDocument()

    const input = footer.querySelector('#messageInput')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveAttribute('placeholder', 'Type your message...')

    const button = footer.querySelector('#sendButton')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Send message')

    const svgIcon = button.querySelector('svg')
    expect(svgIcon).toBeInTheDocument()
  })
})
