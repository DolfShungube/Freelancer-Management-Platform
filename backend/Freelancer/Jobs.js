import {supabase} from '../config/superbaseClient.js';

const fetchJobs = async () => {
  const jobsList = document.querySelector('.job-list');

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    jobsList.innerHTML = '<li>Not logged in.</li>';
    console.error(authError);
    return;
  }

  const currentUserID = authData.user.id;

  // Pass the current user ID to your RPC function (assuming your RPC takes a user ID param)
  const { data, error } = await supabase.rpc('get_jobs_with_client', { freelancer_id: currentUserID });

  if (error) {
    jobsList.innerHTML = '<li>Could not fetch jobs.</li>';
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    jobsList.innerHTML = '<li>No jobs available.</li>';
    return;
  }

  jobsList.innerHTML = '';

  data.forEach(job => {
    const jobCard = document.createElement('li');
    let statusText = '';
    let showViewButton = true;

    if (job.assigned === true) {
      statusText = 'Assigned to you';
    } else if (job.assigned === null) {
      statusText = 'Available';
    } else if (job.assigned === false) {
      statusText = 'Rejected';
      showViewButton = false; // Hide view button for rejected jobs
    }

    jobCard.innerHTML = `
      <form class="job-card">
        <h3>${job.jobname}</h3>
        <p><strong>Client:</strong> ${job.firstname} ${job.lastname}</p>
        <p><strong>Status:</strong> ${statusText}</p>
        ${showViewButton ? '<button type="button" class="view-details-btn">View Details</button>' : ''}
      </form>
    `;

    if (showViewButton) {
      const viewBtn = jobCard.querySelector('.view-details-btn');
      viewBtn.addEventListener('click', () => {
        

        if (job.assigned) {
          localStorage.setItem('jobID', job.id);
          localStorage.setItem('jobName', job.jobname);
          localStorage.setItem('jobDescription', job.description);
          localStorage.setItem('assignedFreelancer', job.freelancerID);
          localStorage.setItem('client', job.clientID);
          localStorage.setItem('job', JSON.stringify(job));
          localStorage.setItem('userType', 'freelancer');
          window.location.href = './progress.html';
        } else {
          const params = new URLSearchParams({
            id: job.id,
            jobName: job.jobname,
            description: job.description,
            firstname: job.firstname,
            lastname: job.lastname

          });
          window.location.href = `ViewJob.html?${params.toString()}`;
        }
      });
    }

    jobsList.appendChild(jobCard);
  });
};

document.addEventListener('DOMContentLoaded', fetchJobs);

