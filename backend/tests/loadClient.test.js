import { describe, it, expect, vi, beforeAll } from 'vitest'

beforeAll(() => {
  // Setup the DOM *before* importing your tested module
  document.body.innerHTML = `
    <div id="userName"></div>
    <button id="addJob"></button>
  `
})

// Now import your module *after* the DOM is ready!
let loaduser
beforeAll(async () => {
  // Clear the module cache to avoid import errors
  vi.resetModules()
  // import *after* setting up DOM
  loaduser = (await import('../database/loadclient.js')).loaduser
})

// Mock supabase and utils
vi.mock('../config/superbaseClient.js', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() =>
        Promise.resolve({
          data: { session: { user: { id: 'user-123' } } }
        })
      )
    }
  }
}));

vi.mock('../database/utils.js', () => ({
  addNewJob: vi.fn(),
  addNewPayment: vi.fn(),
  userProfile: vi.fn(() => Promise.resolve([{ firstname: 'John', lastname: 'Doe' }])),
  clientJobs: vi.fn(() => Promise.resolve([{ id: 1, title: 'Job 1' }])),
  viewJobs: vi.fn(),
  getPayment: vi.fn(),
}))

describe('loaduser function', () => {
  it('should load user and update username text', async () => {
    await loaduser('Client')
    const userName = document.getElementById('userName')
    expect(userName.innerText).toBe('John Doe')
  })
})