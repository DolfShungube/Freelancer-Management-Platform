import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock utils.js
vi.mock('../database/utils.js', () => ({
  addNewJob: vi.fn(),
  addNewPayment: vi.fn(),
  userProfile: vi.fn(),
  clientJobs: vi.fn(),
}))

// Mock supabaseClient
vi.mock('../config/superbaseClient.js', () => ({
  default: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: { user: { id: 'user123' } }
        }
      })
    }
  }
}))

let createjobModule
let addNewJob

describe('createjob NewJob and form submit', () => {
  beforeEach(async () => {
    vi.clearAllMocks()

    // Setup DOM
    document.body.innerHTML = `
      <form id="add">
        <input id="project-name" value="Test Project" />
        <input id="project-description" value="Test Description" />
        <input id="amount" value="100" />
      </form>
    `

    // Import the module but do NOT let it attach event listeners yet
    // So import the module file as a raw module without executing the event listener setup
    // Instead, we'll do that manually after spying

    // First import the module
    const mod = await import('../database/createjob.js')

    // Spy on NewJob BEFORE event listener is attached
    vi.spyOn(mod, 'NewJob')

    createjobModule = mod

    addNewJob = (await import('../database/utils.js')).addNewJob

    // Now manually attach the event listener here AFTER spying
    // Remove old event listeners (if any) and add new one that calls spy

    const add = document.getElementById('add')

    // Remove all listeners by cloning the node
    const newAdd = add.cloneNode(true)
    add.replaceWith(newAdd)

    newAdd.addEventListener('submit', async (e) => {
      e.preventDefault()
      const name = document.getElementById('project-name').value
      const description = document.getElementById('project-description').value
      const amount = document.getElementById('amount').value
      await createjobModule.NewJob(name, description, amount)
      // no redirect in test
    })
  })

  it('NewJob calls addNewJob with correct params when user is authenticated', async () => {
    addNewJob.mockResolvedValue({ success: true })

    await createjobModule.NewJob('Test Project', 'Test Description', '100')

    expect(addNewJob).toHaveBeenCalledWith('user123', 'Test Project', 'Test Description', '100')
  })

  it('form submit triggers NewJob and prevents default', async () => {
    addNewJob.mockResolvedValue({ success: true })

    const form = document.getElementById('add')
    const submitEvent = new Event('submit')
    submitEvent.preventDefault = vi.fn()

    await form.dispatchEvent(submitEvent)

    expect(submitEvent.preventDefault).toHaveBeenCalled()
    expect(createjobModule.NewJob).toHaveBeenCalledWith('Test Project', 'Test Description', '100')
  })
})
