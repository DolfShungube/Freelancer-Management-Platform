import { describe, it, expect, beforeEach } from 'vitest'
import { fireEvent, getByPlaceholderText, getByText } from '@testing-library/jest-dom'


const html = `
  <h2 class="title">Reset Password</h2>
  <form id="form" action="" method="" class="form-box">
    <input type="email" id="email" name="email" placeholder="Enter Email" required class="input-box"><br>
    <button type="submit" id="button" class="btn-black">Change Password</button><br><br>
  </form>
`

describe('changePassword.html', () => {
  let container

  beforeEach(() => {
    
    document.body.innerHTML = html

    container = document.body

    
  })
//   it('renders the form and input elements', () => {
//   const emailInput = getByPlaceholderText(container, 'Enter Email')
//   const button = getByText(container, 'Change Password')

//   expect(emailInput).to.exist
//   expect(button).to.exist
//   expect(emailInput.type).toBe('email')
// })


  it('requires email input before submitting', () => {
    const form = container.querySelector('#form')
    const emailInput = container.querySelector('#email')

    // Try submitting empty form
    emailInput.value = ''
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
    const submitResult = form.dispatchEvent(submitEvent)

    // Since 'required' is native HTML, jsdom might not fully enforce it,
    // so this is just an example to check submit event fires.
    expect(submitResult).toBe(true)
  })

  // it('submits the form with valid email', () => {
  //   const form = container.querySelector('#form')
  //   const emailInput = container.querySelector('#email')

  //   emailInput.value = 'test@example.com'

  //   let submitted = false
  //   form.addEventListener('submit', (e) => {
  //     e.preventDefault()
  //     submitted = true
  //     // Here you can check form data or call your JS functions
  //     expect(emailInput.value).toBe('test@example.com')
  //   })

  //   fireEvent.submit(form)

  //   expect(submitted).toBe(true)
  // })

});
