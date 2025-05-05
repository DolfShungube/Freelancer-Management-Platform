import supabase from '../config/superbaseClient.js';

const fetchJobs = async () => {
  const jobsList = document.querySelector('.job-list');

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    jobsList.innerHTML = '<li>Not logged in.</li>';
    console.error(authError);
    return;
  }

  const currentUserID = authData.user.id;

  const { data, error } = await supabase
    .from('Jobs')
    .select(`
      id,
      jobName,
      description,
      assigned,
      freelancerID,
      Client (
        firstname,
        lastname
      )
    `);

  if (error) {
    jobsList.innerHTML = '<li>Could not fetch jobs.</li>';
    console.error(error);
    return;
  }

  if (data.length === 0) {
    jobsList.innerHTML = '<li>No jobs available.</li>';
    return;
  }

  jobsList.innerHTML = '';

  data.forEach(job => {
    const jobCard = document.createElement('li');
    const status = job.assigned ? 'Assigned' : 'Available';

    jobCard.innerHTML = `
      <form class="job-card">
        <h3>${job.jobName}</h3>
        <p><strong>Client:</strong> ${job.Client.firstname} ${job.Client.lastname}</p>
        <p><strong>Status:</strong> ${status}</p>
        <button type="button" class="view-details-btn">View Details</button>
      </form>
    `;

    const viewBtn = jobCard.querySelector('.view-details-btn');
    viewBtn.addEventListener('click', () => {
      if (job.assigned) {
        // If job is assigned to anyone, open progress
        localStorage.setItem('userType','freelancer')
        window.location.href = 'progress.html';
      } else {
        //  If job is unassigned, open ViewJob.html with details
        const params = new URLSearchParams({
          id: job.id,
          jobName: job.jobName,
          description: job.description,
          firstname: job.Client.firstname,
          lastname: job.Client.lastname
        });
        window.location.href = `ViewJob.html?${params.toString()}`;
      }
    });

    jobsList.appendChild(jobCard);
  });
};

document.addEventListener('DOMContentLoaded', fetchJobs);
