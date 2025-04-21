import supabase from '../config/superbaseClient.js';

const fetchJobs = async () => {
  const jobsList = document.querySelector('.job-list');

  const { data, error } = await supabase
    .from('Jobs')
    .select(`id,
      jobName,
      description,
      Client (
        firstname,
        lastname
      )
    `)
    .eq('assigned', false); // Correct filter syntax

  if (error) {
    jobsList.innerHTML = '<li>Could not fetch jobs.</li>';
    console.error(error);
    return;
  }

  if (data.length === 0) {
    jobsList.innerHTML = '<li>No jobs available.</li>';
    return;
  }

  // Clear job list before adding new cards
  jobsList.innerHTML = '';

  data.forEach(job => {
    const jobCard = document.createElement('li');
    jobCard.innerHTML = `
      <form class="job-card">
        <h3>${job.jobName}</h3>
        <button type="button" class="view-details-btn">View Details</button>
      </form>
    `;

    const viewBtn = jobCard.querySelector('.view-details-btn');

    viewBtn.addEventListener('click', () => {
      const params = new URLSearchParams({
        id: job.id,
        jobName: job.jobName,
        description: job.description,
        firstname: job.Client.firstname,
        lastname: job.Client.lastname
      });

      window.location.href = `ViewJob.html?${params.toString()}`;
    });

    jobsList.appendChild(jobCard);
  });
};

document.addEventListener('DOMContentLoaded', fetchJobs);
