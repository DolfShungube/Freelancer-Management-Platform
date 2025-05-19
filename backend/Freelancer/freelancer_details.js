import supabase from '../config/superbaseClient.js';

const fetchinfo = async () => {
  const Freelancer_info = document.querySelector('.form-profile .profile-text');
  const profileImage = document.getElementById('profile-img');

  // Get the currently logged-in user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    Freelancer_info.innerHTML = '<p>Not logged in.</p>';
    console.error(authError);
    return;
  }

  // Fetch freelancer details by user ID
  const { data, error } = await supabase
  .rpc('get_freelancer_by_user_id', { uid: user.id })
  .single(); // returns a single object instead of an array


  if (error || !data) {
    Freelancer_info.innerHTML = '<p>Could not find profile.</p>';
    console.error(error);
    return;
  }

  // Clear any existing content
  Freelancer_info.innerHTML = '';

  const FreelancerProfile = document.createElement('section');
  FreelancerProfile.classList.add('profile-text');

  FreelancerProfile.innerHTML = `
    <p class="greeting">Hi, ${data.firstname} ${data.lastname}</p>
    <p class="role">Freelancer</p>
  `;

  Freelancer_info.appendChild(FreelancerProfile);
};


fetchinfo(); // Call the function when the script loads
document.getElementById("logout").addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout failed:", error.message);
  } else {
    // Redirect to login page after logout
    window.location.href = "login.html";  // change to your login page path
  }
});
