import supabase from '../config/superbaseClient.js';

const fetchinfo = async () => {
  const Freelancer_info = document.querySelector('.form-profile .profile-text');

  // Get the currently logged-in user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    if (Freelancer_info) {
      Freelancer_info.innerHTML = '<p>Not logged in.</p>';
    }
    console.error(authError);
    return;
  }

  // Fetch freelancer details by user ID
  const { data, error } = await supabase
    .rpc('get_freelancer_by_user_id', { uid: user.id })
    .single();// returns a single object instead of an array

  if (error || !data) {
    if (Freelancer_info) {
      Freelancer_info.innerHTML = '<p>Could not find profile.</p>';
    }
    console.error(error);
    return;
  }

  // Update the top header's username (p tag with id 'userName')
  const nameElement = document.getElementById('userName');
  if (nameElement) {
    nameElement.textContent = `${data.firstname} ${data.lastname}`;
  }

  // Optional: Update additional profile info section if needed
  if (Freelancer_info) {
    Freelancer_info.innerHTML = '';

    const FreelancerProfile = document.createElement('header');
    FreelancerProfile.classList.add('profile-text');
    FreelancerProfile.innerHTML = `
      <p class="username">Hi, ${data.firstname} ${data.lastname}</p>
    `;

    Freelancer_info.appendChild(FreelancerProfile);
  }
};

fetchinfo(); // Call the function when the script loads

// Logout logic
document.getElementById("logout").addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout failed:", error.message);
  } else {
    window.location.href = "login.html"; // change to your login page path
  }
});
