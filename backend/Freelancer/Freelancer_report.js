import supabase from '../config/superbaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Failed to get user:", userError.message);
      return;
    }
    if (!user) {
      console.error("No authenticated user found.");
      return;
    }

    const userId = user.id;

    // Fetch applications + job + client info
    const { data: applications, error } = await supabase
      .from('Aplications')
      .select(`
        id,
        status,
        Jobs (
          id,
          jobName,
          assigned,
          freelancerID,
          clientID,
          Client (
            firstname,
            lastname
          )
        )
      `)
      .eq('freelancerID', userId);  // only this freelancer's apps

    if (error) {
      console.error("Supabase error:", error.message);
      return;
    }

    const appliedJobsBody = document.getElementById("applied-jobs-body");
    const inProgressBody = document.getElementById("freelancer-progress-body");

    appliedJobsBody.innerHTML = "";
    inProgressBody.innerHTML = "";
    

    

    applications.forEach(app => {
      const job = app.Jobs;

      if (app.status === true) {
        // Show jobs that were accepted
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${job.jobName}</td>
          <td>${job.Client ? `${job.Client.firstname} ${job.Client.lastname}` : ''}</td>
          <td>In Progress</td>
          <td>Progress</td>
        `;
        inProgressBody.appendChild(tr);
      } else {
        // Show jobs applied for (pending or rejected)
        let statusText = "Pending";
        if (app.status === false) statusText = "Rejected";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${job.jobName}</td>
          <td>${statusText}</td>
        `;
        appliedJobsBody.appendChild(tr);
      }
    });

  } catch (err) {
    console.error("Unexpected error:", err);
  }
});
