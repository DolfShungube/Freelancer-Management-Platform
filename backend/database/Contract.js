import supabase from '../../../backend/config/superbaseClient.js';

// ✅ SweetAlert2 showAlert function
function showAlert(message, type = 'info') {
    Swal.fire({
        title: type === 'success' ? 'Success!' : 'Oops!',
        text: message,
        icon: type,
        confirmButtonText: 'OK'
    });
}


const params = new URLSearchParams(window.location.search);


// Close modal function
function closeModal() {
    document.getElementById('uploadModal').style.display = 'none';
}

document.getElementById('close-btn')?.addEventListener('click', closeModal);

// File upload and form submission logic
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
    

        if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type)) {
            showAlert('Only PDF, DOC, DOCX, or TXT files are allowed.', 'warning');
            return;
        }

     

        // Get current user
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) {
            showAlert('User not authenticated.', 'error');
            return;
        }

        const user = authData.user;


        // Upload file to Supabase Storage
        const filePath = `contracts/${user}-contract`;
        const { error: uploadError } = await supabase
            .storage
            .from('user-documents')
            .upload(filePath, file);

        if (uploadError) {
            showAlert('Contract upload failed.', 'error');
            return;
        }

        

        Swal.close();
        showAlert('Contract uploaded!', 'success');
        fileList.innerHTML = `<li>${file.name}</li>`;
        fileInput.value = '';
        closeModal();

        // Redirect to Freelancer page
        setTimeout(() => {
            window.location.href = 'progress.html';
        }, 2000);
    });
});
