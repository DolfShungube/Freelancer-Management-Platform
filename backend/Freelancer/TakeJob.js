
  import supabase from '../../../backend/config/superbaseClient.js';

  const params = new URLSearchParams(window.location.search);
  const jobId = params.get('id');

  // Fill in job details
  document.getElementById('client-name').textContent = `${params.get('firstname') || 'First'} ${params.get('lastname') || 'Last'}`;
  document.getElementById('description-text').textContent = params.get('description') || 'No description provided.';

  // Take job logic
  document.querySelector('form.form-job-info').addEventListener('submit', async (e) => {
    e.preventDefault(); // prevent form refresh

    if (!jobId) {
      alert('No job ID found!');
      return;
    }

    const { error } = await supabase
      .from('Jobs')
      .update({ assigned: true })
      .eq('id', jobId);

    if (error) {
      alert('Failed to take job. Please try again.');
      console.error(error);
    } else {
      // Success feedback: cool animation or message
      const button = document.getElementById('apply-btn');
      button.textContent = '🎉 Job Taken!';
      button.disabled = true;

      // Optional: Add animation
      button.style.backgroundColor = '#4CAF50';
      button.style.color = 'white';
      button.style.transition = '0.3s ease';

      // You can also redirect or refresh the list after 2 seconds
      setTimeout(() => {
        window.location.href = 'Freelancer.html'; // Replace with your jobs list page
      }, 2000);
    }
  });

