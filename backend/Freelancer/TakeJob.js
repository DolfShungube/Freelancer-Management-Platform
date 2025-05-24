import {supabase} from '../config/superbaseClient.js';

// SweetAlert2 reusable alert function
function showAlert(message, type = 'info') {
  Swal.fire({
    title: type === 'success' ? 'Success!' : 'Oops!',
    text: message,
    icon: type,
    confirmButtonText: 'OK'
  });
}

// Get job ID and other params from URL
const params = new URLSearchParams(window.location.search);
const jobId = params.get('id');
const firstName = params.get('firstname') || 'First';
const lastName = params.get('lastname') || 'Last';
const description = params.get('description') || 'No description provided.';
const jobName = params.get('jobName');

document.addEventListener('DOMContentLoaded', async () => {
  const jobNames = document.getElementById('job-title');
  const applyBtn = document.getElementById('apply-btn');
  const clientName = document.getElementById('client-name');
  const descriptionText = document.getElementById('description-text');

  if (!applyBtn || !clientName || !descriptionText || !jobNames) {
    console.error('Required DOM elements not found.');
    return;
  }

  // Fill in job details
  clientName.textContent = `${firstName} ${lastName}`;
  descriptionText.textContent = description;
  console.log("jobName from URL:", jobName);
  jobNames.textContent = `Job Title: ${jobName || 'Unknown'}`;

  // Get the logged-in user
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    showAlert('User not authenticated.', 'error');
    applyBtn.disabled = true;
    applyBtn.textContent = 'Please log in to apply';
    return;
  }

  const freelancerID = authData.user.id;

  if (!jobId) {
    showAlert('No job ID found!', 'error');
    applyBtn.disabled = true;
    return;
  }

  try {
    // Check if user has already applied using your has_applied RPC function
    const { data: hasApplied, error: hasAppliedError } = await supabase.rpc('has_applied', {
      p_job_id: jobId,
      p_freelancer_id: freelancerID
    });

    if (hasAppliedError) {
      console.error('Error checking application status:', hasAppliedError);
      // Allow applying anyway but maybe warn user?
    } else if (hasApplied === true || (Array.isArray(hasApplied) && hasApplied[0] === true)) {
      // User already applied — disable button and show message
      applyBtn.disabled = true;
      applyBtn.textContent = 'Your application has already been submitted';
      return; // no need to add event listener
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }

  // If not applied, allow application
  applyBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    // Get freelancer details using RPC
    const { data: freelancer, error: freelancerError } = await supabase.rpc('get_freelancer_by_user_id', { uid: freelancerID });
    if (freelancerError || !freelancer) {
      console.error(freelancerError);
      showAlert('Freelancer not found.', 'error');
      return;
    }

    // Insert application using RPC
    const { error: insertError } = await supabase.rpc('insert_application', {
      p_job_id: jobId,
      p_freelancer_id: freelancerID,
      p_status: null // optional: leave null if default is handled in SQL
    });

    if (insertError) {
      showAlert('Application failed.', 'error');
      return;
    }

    // Show success, disable button, and redirect after delay
    showAlert('Application submitted successfully!', 'success');
    applyBtn.disabled = true;
    applyBtn.textContent = 'Your application has been submitted';

    setTimeout(() => {
      window.location.href = 'Freelancer.html';
    }, 2000);
  });
});
