import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase client
vi.mock('../config/superbaseClient.js', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
    },
  },
}));

// Mock showAlert from utils.js
vi.mock('../login/utils.js', () => ({
  showAlert: vi.fn(),
}));

import {supabase} from '../config/superbaseClient.js';
import { showAlert } from '../login/utils.js';

beforeEach(async () => {
  vi.resetModules();
  vi.clearAllMocks();

  document.body.innerHTML = `
    <select id="accountType">
      <option value="">Select Account</option>
      <option value="Admin">Admin</option>
      <option value="Freelancer">Freelancer</option>
      <option value="Client">Client</option>
    </select>
    <button id="SignInWithGoogle"></button>
  `;

  // Adjust this import path to where your actual signin code is relative to tests folder
  await import('../login/signinwithgoogle.js'); 
});

describe('Google SignIn button tests', () => {
  it('shows alert if no account type is selected', async () => {
    document.getElementById('accountType').value = '';

    document.getElementById('SignInWithGoogle').click();

    expect(showAlert).toHaveBeenCalledWith('please select an account Type to proceed', 'error');
    expect(supabase.auth.signInWithOAuth).not.toHaveBeenCalled();
  });

  it('shows alert if Admin is selected', async () => {
    document.getElementById('accountType').value = 'Admin';

    document.getElementById('SignInWithGoogle').click();

    expect(showAlert).toHaveBeenCalledWith('Admins can only use email sign in', 'error');
    expect(supabase.auth.signInWithOAuth).not.toHaveBeenCalled();
  });

  it('calls supabase.auth.signInWithOAuth with correct redirect for Freelancer', async () => {
    document.getElementById('accountType').value = 'Freelancer';

    supabase.auth.signInWithOAuth.mockResolvedValue({ data: {}, error: null });

    document.getElementById('SignInWithGoogle').click();

    await new Promise((r) => setTimeout(r, 0)); // wait for async

    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo:
          'https://victorious-tree-0efc89c00.6.azurestaticapps.net/frontend/src/pages/Freelancer.html',
      },
    });

    expect(showAlert).not.toHaveBeenCalled();
  });

  it('shows alert if supabase returns error', async () => {
    document.getElementById('accountType').value = 'Client';

    supabase.auth.signInWithOAuth.mockResolvedValue({
      data: null,
      error: { message: 'Some error' },
    });

    document.getElementById('SignInWithGoogle').click();

    await new Promise((r) => setTimeout(r, 0)); // wait for async

    expect(showAlert).toHaveBeenCalledWith('Some error', 'error');
  });
});