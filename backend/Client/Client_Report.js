import {supabase} from '../config/superbaseClient.js';
import { progressCalculator } from '../database/utils.js';
import { progressReport } from '../progressReport/Utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Step 1: Get authenticated client
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Authentication error:", userError?.message || "User not found");
      return;
    }

    const clientId = user.id;

    // Step 2: Fetch jobs via RPC
    const { data: jobData, error } = await supabase.rpc('get_client_jobs', {
      client_uuid: clientId,
    });

    if (error) {
      console.error("Failed to fetch jobs via RPC:", error.message);
      return;
    }

    // Group data by job.id
    const jobsMap = new Map();

    for (const row of jobData) {
      if (!jobsMap.has(row.id)) {
        jobsMap.set(row.id, {
          id: row.id,
          jobName: row.jobname,
          assigned: row.assigned,
          freelancerID: row.freelancerid,
          applications: [],
        });
      }

      if (row.application_id) {
        jobsMap.get(row.id).applications.push({
          id: row.application_id,
          freelancerID: row.application_freelancerid,
          status: row.application_status,
          Freelancer: {
            firstname: row.freelancer_firstname,
            lastname: row.freelancer_lastname,
          },
        });
      }
    }

    // DOM Elements
    const createdBody = document.getElementById("created-jobs-body");
    const applicationBody = document.getElementById("application-stage-body");
    const progressBody = document.getElementById("in-progress-body");

    createdBody.innerHTML = "";
    applicationBody.innerHTML = "";
    progressBody.innerHTML = "";

    for (const job of jobsMap.values()) {
      const hasApplicants = job.applications.length > 0;
      const isAssigned = job.assigned && job.freelancerID;

      if (!hasApplicants && !isAssigned) {
        // Case 1: Created job with no applicants
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${job.jobName}</td>`;
        createdBody.appendChild(tr);

      } else if (hasApplicants && !isAssigned) {
        // Case 2: Job has applicants, not yet assigned
        for (const app of job.applications) {
          const applicantName = app.Freelancer
            ? `${app.Freelancer.firstname} ${app.Freelancer.lastname}`
            : "Unknown";

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${job.jobName}</td>
            <td>${applicantName}</td>
          `;
          applicationBody.appendChild(tr);
        }

      } else if (isAssigned) {
        // Case 3: Job assigned, show progress
        const progress = new progressReport();
        const allTasks = await progress.getTasks(job.id);
        const completedTasks = await progress.getCompletedTasks(allTasks);

        const total = allTasks.length;
        const done = completedTasks.length;
        const progressPercent = progressCalculator(total, done).toFixed(2);
        const status = progressPercent === "100.00" ? "Completed" : "In Progress";

        // Find assigned freelancer name
        const assignedApp = job.applications.find(app => app.freelancerID === job.freelancerID);
        const freelancerName = assignedApp?.Freelancer
          ? `${assignedApp.Freelancer.firstname} ${assignedApp.Freelancer.lastname}`
          : "Unknown";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${job.jobName}</td>
          <td>${freelancerName}</td>
          <td>${status} (${progressPercent}%)</td>
        `;
        progressBody.appendChild(tr);
      }
    }

  } catch (err) {
    console.error("Unexpected error:", err);
  }
});
