import supabase from '../config/superbaseClient.js';

//SweetAlert2 showAlert function
function showAlert(message, type = 'info') {
    Swal.fire({
        title: type === 'success' ? 'Success!' : 'Oops!',
        text: message,
        icon: type, // 'success', 'error', 'warning', 'info'
        confirmButtonText: 'OK'
    });
}

const params = new URLSearchParams(window.location.search);
const jobId = params.get('id');

// Fill in job details
document.getElementById('client-name').textContent =
  `${params.get('firstname') || 'First'} ${params.get('lastname') || 'Last'}`;
document.getElementById('description-text').textContent =
  params.get('description') || 'No description provided.';

// Take job logic
document.querySelector('form.form-job-info').addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!jobId) {
    showAlert('No job ID found!', 'error');
    return;
  }

  const { error } = await supabase
    .from('Jobs')
    .update({ assigned: true })
    .eq('id', jobId);

  if (error) {
    showAlert('Failed to take job. Please try again.', 'error');
    console.error(error);
    return;
  }

  // Show upload popup
  document.getElementById('uploadModal').style.display = 'block';
});

// Upload button logic
document.getElementById('apply-btn').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('uploadModal').style.display = 'block';
  document.getElementById('apply-btn').style.display ='none';
});

// Close modal function
function closeModal() {
  document.getElementById('uploadModal').style.display = 'none';
}

document.getElementById('close-btn')?.addEventListener('click', () => {
  closeModal();
  document.getElementById('apply-btn').style.display = 'inline';
});


// DOMContentLoaded logic
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const uploadForm = document.getElementById('uploadForm');
  const fileList = document.getElementById('fileList');

  uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
      showAlert('Please select a file.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Uploading...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    if (file.type !== 'application/pdf') {
      showAlert('Only PDF files are allowed.', 'warning');
      return;
    }

    if (!jobId) {
      showAlert('Job ID not found in URL.', 'error');
      document.getElementById('apply-btn').style.display ='inline';
      return;
    }

    // Get Freelancer info from Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      showAlert('User not authenticated.', 'error');
      document.getElementById('apply-btn').style.display ='inline';
      return;
    }

    const user = authData.user;

    // Get freelancer ID by email
    const { data: freelancer, error: freelancerError } = await supabase
      .from('Freelancer')
      .select('id')
      .eq('id', user.id)
      .single();

    if (freelancerError || !freelancer) {
      showAlert('Freelancer not found.', 'error');
      document.getElementById('apply-btn').style.display ='inline';
      return;
    }

    const freelancerID = freelancer.id;

    // Upload CV to Supabase Storage
    const filePath = `cv/${freelancerID}-cv`;
    const { error: uploadError } = await supabase
      .storage
      .from('user-documents')
      .upload(filePath, file);

    if (uploadError) {
      Swal.close();
     // console.error('Upload error:', uploadError.message);
      showAlert('CV upload failed.', 'error');
      document.getElementById('apply-btn').style.display ='inline';
      return;
    }

    // Insert into Applications table
    const { error: insertError } = await supabase
      .from('Aplications') // still spelled as "Aplications"—make sure this is intentional!
      .insert([{
        jobID: jobId,
        freelancerID: freelancerID,
        status: null
      }]);

    if (insertError) {
      console.error(insertError.message);
      showAlert('Application failed.', 'error');
      document.getElementById('apply-btn').style.display ='inline';
      return;
    }

    showAlert('CV uploaded and application submitted!', 'success');
    fileList.innerHTML = `<li>${file.name}</li>`;
    fileInput.value = '';

    // Close modal
    closeModal();

    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = 'Freelancer.html';
    }, 2000);
  });
});
