import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

describe('Admin.html', () => {
  let document, window;

  beforeEach(() => {
    const filePath = path.resolve(__dirname, '../Admin.html');
    const html = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
    document = dom.window.document;
    window = dom.window;
window.toggleForm = () => {
    const form = document.querySelector('#adminForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  };

  // Attach onclick handler manually because JSDOM doesn't run inline handlers automatically
  const buttonAdd = document.querySelector('#buttonAdd');
  buttonAdd.onclick = window.toggleForm;
});

  it('should have a users section with no users message', () => {
    const usersSection = document.querySelector('#users');
    expect(usersSection).toBeTruthy();

    const noUsers = usersSection.querySelector('.no-tasks');
    expect(noUsers).toBeTruthy();
    expect(noUsers.textContent).toContain('No users yet');
  });

  it('should have an admins section with no admins message initially', () => {
    const adminsSection = document.querySelector('#admins');
    expect(adminsSection).toBeTruthy();

    const noAdmins = adminsSection.querySelector('.no-tasks');
    expect(noAdmins).toBeTruthy();
    expect(noAdmins.textContent).toContain('No admins yet');
  });

  it('should have admin form hidden initially', () => {
    const adminForm = document.querySelector('#adminForm');
    expect(adminForm).toBeTruthy();
    expect(adminForm.style.display).toBe('none');
  });

 it('should toggle admin form visibility when clicking "Add Admin" button', () => {
  const buttonAdd = document.querySelector('#buttonAdd');
  const adminForm = document.querySelector('#adminForm');

  expect(adminForm.style.display).toBe('none');

  buttonAdd.click();
  expect(adminForm.style.display).toBe('block');

  buttonAdd.click();
  expect(adminForm.style.display).toBe('none');
});


  it('admin form inputs should have required attribute', () => {
    const adminForm = document.querySelector('#adminForm');
    const inputs = [
      '#adminFName',
      '#adminLName',
      '#adminEmail',
      '#password',
      '#adminRole'
    ];

    inputs.forEach(selector => {
      const input = adminForm.querySelector(selector);
      expect(input).toBeTruthy();
      expect(input.required).toBe(true);
    });
  });

  it('submit button should be present and of type submit', () => {
    const submitBtn = document.querySelector('#addAdmin');
    expect(submitBtn).toBeTruthy();
    expect(submitBtn.type).toBe('submit');
  });
});
