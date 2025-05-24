import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../login/utils.js', () => ({
  getDetails: vi.fn(),
  getDetailValues: vi.fn(),
  issueTracker: vi.fn(),
  handleUserInput: vi.fn(),
  showAlert: vi.fn(),
}));

let getDetails, getDetailValues, issueTracker, handleUserInput, showAlert;

const mockWindowLocation = { href: '' };
Object.defineProperty(window, 'location', {
  value: mockWindowLocation,
  writable: true,
});

beforeEach(async () => {
  vi.resetModules();
  vi.clearAllMocks();

  document.body.innerHTML = `<form id="form"></form>`;
  window.location.href = '';

  const utils = await import('../login/utils.js');
  getDetails = utils.getDetails;
  getDetailValues = utils.getDetailValues;
  issueTracker = utils.issueTracker;
  handleUserInput = utils.handleUserInput;
  showAlert = utils.showAlert;

  await import('../login/signin.js');
});

describe('SignIn form submission tests', () => {
  // Test redirection for all three user types
  const userTypes = ['Freelancer', 'Client', 'Admin'];

  userTypes.forEach((type) => {
    it(`redirects to ${type}.html on successful login for ${type}`, async () => {
      getDetails.mockReturnValue({});
      getDetailValues.mockReturnValue({ userType: type });
      issueTracker.mockReturnValue([]);
      handleUserInput.mockResolvedValue('');

      const form = document.getElementById('form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      await new Promise((r) => setTimeout(r, 0));

      expect(handleUserInput).toHaveBeenCalled();
      expect(window.location.href).toBe(`${type}.html`);
      expect(showAlert).not.toHaveBeenCalled();
    });
  });

  it('shows alert if login returns error', async () => {
    getDetails.mockReturnValue({});
    getDetailValues.mockReturnValue({ userType: 'Client' });
    issueTracker.mockReturnValue([]);
    handleUserInput.mockResolvedValue('Invalid credentials');

    const form = document.getElementById('form');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    await new Promise((r) => setTimeout(r, 0));

    expect(handleUserInput).toHaveBeenCalled();
    expect(showAlert).toHaveBeenCalledWith('Invalid credentials', 'error');
    expect(window.location.href).toBe('');
  });

  it('prevents submission if there are issues', () => {
    getDetails.mockReturnValue({});
    getDetailValues.mockReturnValue({ userType: 'Admin' });
    issueTracker.mockReturnValue(['Some issue']);

    const form = document.getElementById('form');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    submitEvent.preventDefault = vi.fn();

    form.dispatchEvent(submitEvent);

    expect(issueTracker).toHaveBeenCalled();
    expect(handleUserInput).not.toHaveBeenCalled();
    expect(submitEvent.preventDefault).toHaveBeenCalled();
    expect(window.location.href).toBe('');
  });
});