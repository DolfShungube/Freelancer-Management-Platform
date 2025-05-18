import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

describe('Aplication.html', () => {
  let document;

  beforeEach(() => {
    // Adjust the path to where your HTML file is stored
    const filePath = path.resolve(__dirname, '../Aplication.html');
    const html = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(html);
    document = dom.window.document;
  });

  it('should have a form with class "form-header" containing a title and buttons', () => {
    const formHeader = document.querySelector('form.form-header');
    expect(formHeader).toBeTruthy();

    const title = formHeader.querySelector('h1');
    expect(title).toBeTruthy();
    expect(title.textContent).toContain('Freelancio');

    const searchBtn = formHeader.querySelector('#search-icon');
    const menuBtn = formHeader.querySelector('#menu-icon');
    expect(searchBtn).toBeTruthy();
    expect(menuBtn).toBeTruthy();
  });

  it('should have a form with class "form-job-info" containing job title, job id, and description', () => {
    const formJobInfo = document.querySelector('form.form-job-info');
    expect(formJobInfo).toBeTruthy();

    const jobTitle = formJobInfo.querySelector('#jobtitle');
    expect(jobTitle).toBeTruthy();
    expect(jobTitle.textContent).toBe('What is the job');

    const jobIdLabel = formJobInfo.querySelector('.requirements-label');
    const jobIdText = formJobInfo.querySelector('#job-id');
    expect(jobIdLabel).toBeTruthy();
    expect(jobIdText).toBeTruthy();
    expect(jobIdLabel.textContent.toLowerCase()).toContain('job-id');
    expect(jobIdText.textContent.toLowerCase()).toContain('job');

    const descriptionLabel = formJobInfo.querySelector('.description-label');
    const descriptionText = formJobInfo.querySelector('#description-text');
    expect(descriptionLabel).toBeTruthy();
    expect(descriptionText).toBeTruthy();
    expect(descriptionLabel.textContent.toLowerCase()).toContain('job description');
    expect(descriptionText.textContent.toLowerCase()).toContain('description of the job');
  });

  it('should have a section for applications with a list for applicants', () => {
    const aplicationsSection = document.querySelector('section.aplications');
    expect(aplicationsSection).toBeTruthy();

    const header = aplicationsSection.querySelector('h1');
    expect(header).toBeTruthy();
    expect(header.textContent.toLowerCase()).toContain('aplications');

    const aplicantsList = aplicationsSection.querySelector('#myAplicants');
    expect(aplicantsList).toBeTruthy();
    expect(aplicantsList.tagName.toLowerCase()).toBe('ul');
  });
});
