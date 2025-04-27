import supabase from '../../../backend/config/superbaseClient.js';
import Swal from 'sweetalert2'; // Import SweetAlert2 if you're using modules

// Show nice alerts
function showAlert(message, type = 'info') {
  Swal.fire({
    title: type === 'success' ? 'Success!' : 'Oops!',
    text: message,
    icon: type, // 'success', 'error', 'warning', 'info'
    confirmButtonText: 'OK'
  });
}

// Get parameters from URL
const params = new URLSearchParams(window.location.search);
const jobId = params.get('id');

// Fill in job details
document.getElementById('client-name').textContent = `${params.get('firstname') || 'First'} ${params.get('lastname') || 'Last'}`;
document.getElementById('description-text').textContent = params.get('description') || 'No description provided.';

// Take job logic
document.querySelector('form.form-job-info').addEventListener('submit', async (e) => {
  e.preventDefault(); // prevent form refresh

  if (!jobId) {
    showAlert('No job ID found!', 'error');
    return;
  }

  const { data, error } = await supabase
    .from('Jobs')
    .update({ assigned: true })
    .eq('id', jobId);

  if (error) {
    showAlert('Failed to take job. Please try again.', 'error');
    console.error(error);
  } else {
    showAlert('You have successfully taken the job!', 'success');

    // Optional: disable button after taking
    const button = document.getElementById('apply-btn');
    if (button) {
      button.disabled = true;
      button.style.backgroundColor = '#4CAF50';
      button.style.color = 'white';
    }

    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = 'Freelancer.html'; // Your jobs page
    }, 2000);
  }
});
