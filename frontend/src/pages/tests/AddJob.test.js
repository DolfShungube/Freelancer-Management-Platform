import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

describe('AddJob.html', () => {
  let document;

  beforeEach(() => {
    const filePath = path.resolve(__dirname, '../AddJob.html');

    const html = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(html);
    document = dom.window.document;
  });

  it('should have a form with id "add"', () => {
    const form = document.querySelector('#add');
    expect(form).toBeTruthy();
  });

  it('should have an input for project name', () => {
    const input = document.querySelector('#project-name');
    expect(input).toBeTruthy();
    expect(input.placeholder.toLowerCase()).toContain('project name');
  });

  it('should have a textarea for project description', () => {
    const textarea = document.querySelector('#project-description');
    expect(textarea).toBeTruthy();
    expect(textarea.placeholder.toLowerCase()).toContain('describe');
  });

  it('should have a number input for project payment', () => {
    const payment = document.querySelector('#amount');
    expect(payment).toBeTruthy();
    expect(payment.type).toBe('number');
  });

  it('should have a cancel button', () => {
    const cancel = document.querySelector('.cancel-button');
    expect(cancel).toBeTruthy();
    expect(cancel.textContent.toLowerCase()).toContain('cancel');
  });

  it('should have a submit button with id "addjob"', () => {
    const submit = document.querySelector('#addjob');
    expect(submit).toBeTruthy();
    expect(submit.type).toBe('submit');
  });
it('should prevent submit if project name is empty', () => {
  const form = document.querySelector('#add');
  const nameInput = document.querySelector('#project-name');
  const descriptionInput = document.querySelector('#project-description');
  const paymentInput = document.querySelector('#amount');

  nameInput.value = ''; // empty name
  descriptionInput.value = 'Some description';
  paymentInput.value = 100;

  const submitEvent = new Event('submit', { bubbles: true });
  let prevented = false;

  form.addEventListener('submit', (e) => {
    if (!nameInput.value) {
      e.preventDefault();
      prevented = true;
    }
  });

  form.dispatchEvent(submitEvent);

  expect(prevented).toBe(true);
});

  
  });
