import supabase from '../../../backend/config/superbaseClient.js';

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

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  const applyBtn = document.getElementById('apply-btn');
  const clientName = document.getElementById('client-name');
  const descriptionText = document.getElementById('description-text');

  if (!applyBtn || !clientName || !descriptionText) {
    console.error('Required DOM elements not found.');
    return;
  }

  // Fill in job details
  clientName.textContent = `${firstName} ${lastName}`;
  descriptionText.textContent = description;

  applyBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!jobId) {
      showAlert('No job ID found!', 'error');
      return;
    }

    // Get the logged-in user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      showAlert('User not authenticated.', 'error');
      return;
    }

    const freelancerID = authData.user.id;

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

    // Show success and redirect
    showAlert('Application submitted successfully!', 'success');
    applyBtn.style.display = 'none';

    setTimeout(() => {
      window.location.href = 'Freelancer.html';
    }, 2000);
  });
});
