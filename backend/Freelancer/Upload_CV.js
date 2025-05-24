import {supabase} from '../config/superbaseClient.js';

// SweetAlert2 showAlert function
function showAlert(message, type = 'info') {
  Swal.fire({
    title: type === 'success' ? 'Success!' : 'Oops!',
    text: message,
    icon: type,
    confirmButtonText: 'OK'
  });
}

// Toggle modal visibility
function toggleModal(show = false) {
  const modal = document.getElementById('uploadModal');
  modal.style.display = show ? 'block' : 'none';
}

// UI Buttons
const uploadBtn = document.getElementById('upload-CV-button');
const reuploadBtn = document.getElementById('re-upload-CV');
const viewCVBtn = document.getElementById('View-CV');
const filenameDisplay = document.getElementById('upload-CV');
const fileList = document.getElementById('fileList');
const fileInput = document.getElementById('fileInput');
const uploadForm = document.getElementById('uploadForm');
let freelancerID = null;
let isReupload = false;

// Initial state setup
async function setupButtonsBasedOnCV() {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    showAlert('User not authenticated.', 'error');
    return;
  }

  const user = authData.user;

  const { data: freelancer, error: freelancerError } = await supabase
    .from('Freelancer')
    .select('id')
    .eq('id', user.id)
    .single();

  if (freelancerError || !freelancer) {
    showAlert('Freelancer not found.', 'error');
    return;
  }

  freelancerID = freelancer.id;
  const filePath = `cv/${freelancerID}-cv`;

  // Try to get a signed URL for checking existence
  const { data, error } = await supabase
    .storage
    .from('user-documents')
    .createSignedUrl(filePath, 60);

  if (!error && data?.signedUrl) {
    // File exists
    uploadBtn.style.display = 'none';
    reuploadBtn.style.display = 'inline';
    viewCVBtn.style.display = 'inline';

    const fileName = `${freelancerID}-cv.pdf`;
    filenameDisplay.textContent = `Uploaded CV: ${fileName}`;
    fileList.innerHTML = `<li>${fileName}</li>`;

    // Set view button click
    viewCVBtn.onclick = () => {
      window.open(data.signedUrl, '_blank');
    };
  } else {
    // File doesn't exist
    uploadBtn.style.display = 'inline';
    reuploadBtn.style.display = 'none';
    viewCVBtn.style.display = 'none';
  }
}

// Main logic
document.addEventListener('DOMContentLoaded', async () => {
  await setupButtonsBasedOnCV();

  // Upload CV button click
  uploadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isReupload = false;
    toggleModal(true);
  });

  // Re-upload button click
  reuploadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isReupload = true;
    toggleModal(true);
  });

  // Close modal button
  document.getElementById('close-btn')?.addEventListener('click', () => {
    toggleModal(false);
  });

  // Upload form submission
  uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
      showAlert('Please select a file.', 'warning');
      return;
    }

    if (file.type !== 'application/pdf') {
      showAlert('Only PDF files are allowed.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Uploading...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const filePath = `cv/${freelancerID}-cv`;
    const { error: uploadError } = await supabase
      .storage
      .from('user-documents')
      .upload(filePath, file, { upsert: true });

    Swal.close();

    if (uploadError) {
      showAlert(isReupload ? 'CV re-upload failed.' : 'CV upload failed.', 'error');
      return;
    }

    // CALL RPC TO UPDATE CV METADATA IN DB
    const { error: rpcError } = await supabase
      .rpc('upsert_freelancer_cv', {
        f_id: freelancerID,
        f_name: file.name
      });

    if (rpcError) {
      console.error('Error updating CV metadata:', rpcError.message);
      showAlert('Failed to update CV ', 'error');
      return;
    }

    showAlert(isReupload ? 'CV re-uploaded successfully!' : 'CV uploaded!', 'success');

    filenameDisplay.textContent = `Uploaded CV: ${file.name}`;
    fileList.innerHTML = `<li>${file.name}</li>`;
    fileInput.value = '';
    toggleModal(false);

    uploadBtn.style.display = 'none';
    reuploadBtn.style.display = 'inline';
    viewCVBtn.style.display = 'inline';

    // Get new signed URL and update View CV
    const { data } = await supabase
      .storage
      .from('user-documents')
      .createSignedUrl(filePath, 60);

    if (data?.signedUrl) {
      viewCVBtn.onclick = () => {
        window.open(data.signedUrl, '_blank');
      };
    }
  });

  // Optional: Remove unused click event listener from your snippet
});
