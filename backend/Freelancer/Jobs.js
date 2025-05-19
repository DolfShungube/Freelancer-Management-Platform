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

  const { data, error } = await supabase.rpc('get_jobs_with_client');

  if (error) {
    jobsList.innerHTML = '<li>Could not fetch jobs.</li>';
    
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
        <h3>${job.jobname}</h3>
        <p><strong>Client:</strong> ${job.firstname} ${job.lastname}</p>
        <p><strong>Status:</strong> ${status}</p>
        <button type="button" class="view-details-btn">View Details</button>
      </form>
    `;

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
          firstname: job.firstname,     // FIXED
          lastname: job.lastname        // FIXED
        });
        window.location.href = `ViewJob.html?${params.toString()}`;
      }
    });

    jobsList.appendChild(jobCard);
  });
};

document.addEventListener('DOMContentLoaded', fetchJobs);
