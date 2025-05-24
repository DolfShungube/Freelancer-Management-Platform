import {supabase} from '../config/superbaseClient.js';
import { progressCalculator } from '../database/utils.js';
import { progressReport } from '../progressReport/Utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  const appliedJobsBody = document.getElementById("applied-jobs-body");
  const inProgressBody = document.getElementById("freelancer-progress-body");

  // Clear the tables before appending new rows
  appliedJobsBody.innerHTML = "";
  inProgressBody.innerHTML = "";

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

    // Fetch applications + job + client info using your RPC function
    const { data: applications, error } = await supabase
      .rpc('get_applications_with_jobs_and_client', { uid: userId });

    if (error) {
      console.error("Supabase error:", error.message);
      return;
    }

    // Clear again just in case
    appliedJobsBody.innerHTML = "";
    inProgressBody.innerHTML = "";

    for (const app of applications) {
      if (app.status === true) {
        const progress = new progressReport();
        const alltasks = await progress.getTasks(app.job_id);
        const completedTasks = await progress.getCompletedTasks(alltasks);
        const total = alltasks.length;
        const done = completedTasks.length;
        const progressPercent = progressCalculator(total, done).toFixed(2);
        const progress_status = progressPercent == 100 ? "Completed" : "In Progress";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${app.job_name}</td>
          <td>${app.client_firstname} ${app.client_lastname}</td>
          <td>${progress_status}</td>
          <td>${progressPercent}%</td>
        `;
        inProgressBody.appendChild(tr);
      } else {
        let statusText = "Pending";
        if (app.status === false) statusText = "Rejected";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${app.job_name}</td>
          <td>${statusText}</td>
        `;
        appliedJobsBody.appendChild(tr);
      }
    }

  } catch (err) {
    console.error("Unexpected error:", err);
  }
});
