import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase client
vi.mock('../config/superbaseClient.js', () => ({
  default: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  },
}));

import supabase from '../config/superbaseClient.js';

// Import the functions but mock showAlert only for mainIcon tests
import * as utils from '../login/utils.js';

beforeEach(() => {
  vi.resetAllMocks();
  document.body.innerHTML = `
    <select id="accountType">
      <option value="">Select Account</option>
      <option value="Admin">Admin</option>
      <option value="Freelancer">Freelancer</option>
      <option value="Client">Client</option>
    </select>
    <input type="email" id="email" />
    <input type="password" id="password" />
    <button id="logout"></button>
  `;
});

describe('utils.js', () => {
  describe('getDetails', () => {
    it('returns the elements for userType, email, and password', () => {
      const details = utils.getDetails();
      expect(details.userType).toBe(document.getElementById('accountType'));
      expect(details.email).toBe(document.getElementById('email'));
      expect(details.password).toBe(document.getElementById('password'));
    });
  });

  describe('getDetailValues', () => {
    it('returns the values of userType, email, and password inputs', () => {
      document.getElementById('accountType').value = 'Client';
      document.getElementById('email').value = 'test@example.com';
      document.getElementById('password').value = 'mypassword';

      const values = utils.getDetailValues();

      expect(values.userType).toBe('Client');
      expect(values.email).toBe('test@example.com');
      expect(values.password).toBe('mypassword');
    });
  });

  describe('registrationDetailsPresent', () => {
    it('returns false if any detail is empty', () => {
      expect(utils.registrationDetailsPresent({ userType: '', email: 'a', password: 'b' })).toBe(false);
      expect(utils.registrationDetailsPresent({ userType: 'x', email: '', password: 'b' })).toBe(false);
      expect(utils.registrationDetailsPresent({ userType: 'x', email: 'a', password: '' })).toBe(false);
    });

    it('returns true if all details are present', () => {
      expect(utils.registrationDetailsPresent({ userType: 'x', email: 'a', password: 'b' })).toBe(true);
    });
  });

  describe('existingEmail', () => {
    it('returns true if email is not empty', () => {
      expect(utils.existingEmail('test@example.com')).toBe(true);
    });

    it('returns false if email is empty', () => {
      expect(utils.existingEmail('')).toBe(false);
    });
  });

  describe('issueTracker', () => {
    it('returns an issue if registration details are incomplete', () => {
      const details = {};
      const detailValues = { userType: '', email: '', password: '' };
      const issues = utils.issueTracker(details, detailValues);
      expect(issues).toContain('please fill in all the required details');
    });

    it('returns empty issues if registration details are complete', () => {
      const details = {};
      const detailValues = { userType: 'Client', email: 'a@b.com', password: '123' };
      const issues = utils.issueTracker(details, detailValues);
      expect(issues).toHaveLength(0);
    });
  });

  describe('handleUserInput', () => {
    it('returns error message if supabase signInWithPassword errors', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({ data: null, error: { message: 'Invalid login' } });

      const result = await utils.handleUserInput({ userType: 'Client', email: 'test@test.com', password: '1234' });

      expect(result).toBe('Invalid login');
    });

    it('returns error message if account check errors', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({ data: { user: { id: 'user123' } }, error: null });

      const fromMock = {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Not registered' } })),
          })),
        })),
      };
      supabase.from.mockReturnValue(fromMock);

      const result = await utils.handleUserInput({ userType: 'Client', email: 'test@test.com', password: '1234' });
      expect(result).toBe('you are not registered for the selected account Type');
    });

    it('returns empty string if sign-in and account check succeed', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({ data: { user: { id: 'user123' } }, error: null });

      const singleMock = vi.fn(() => Promise.resolve({ data: { id: 'user123' }, error: null }));
      const eqMock = vi.fn(() => ({ single: singleMock }));
      const selectMock = vi.fn(() => ({ eq: eqMock }));
      const fromMock = { select: selectMock };

      supabase.from.mockReturnValue(fromMock);

      const result = await utils.handleUserInput({ userType: 'Client', email: 'test@test.com', password: '1234' });
      expect(result).toBe('');
    });

    it('catches unexpected errors in try-catch', async () => {
      supabase.auth.signInWithPassword.mockRejectedValue(new Error('Unexpected failure'));

      const result = await utils.handleUserInput({ userType: 'Client', email: 'test@test.com', password: '1234' });
      expect(result).toBe('Unexpected failure');
    });
  });

  // Removed showAlert tests as requested

  describe('mainIcon', () => {
    // Mock showAlert to prevent calling Swal.fire
    beforeEach(() => {
      vi.spyOn(utils, 'showAlert').mockImplementation(() => {});
    });

    it('adds click listener to logout and calls supabase signOut and redirects on success', async () => {
      supabase.auth.signOut.mockResolvedValue({ error: null });

      // Mock window.location.replace
      const replaceMock = vi.fn();
      delete window.location;
      window.location = { replace: replaceMock };

      utils.mainIcon();

      const logoutButton = document.getElementById('logout');
      logoutButton.dispatchEvent(new Event('click'));

      await new Promise((r) => setTimeout(r, 0));

      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(replaceMock).toHaveBeenCalledWith('./login.html');
    });
  });
});