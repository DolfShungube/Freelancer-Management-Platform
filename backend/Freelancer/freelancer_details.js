import supabase from '../config/superbaseClient.js';

const fetchinfo = async () => {
  const Freelancer_info = document.querySelector('.profile-info');

  // Get the currently logged-in user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    Freelancer_info.innerHTML = '<p>Not logged in.</p>';
    console.error(authError);
    return;
  }

  // Fetch freelancer details by user ID
  const { data, error } = await supabase
    .from('Freelancer')
    .select("*")
    .eq("id", user.id)
    .single();

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
    <img src="${data.profilepicture || 'images/profile_picture.jpg'}" alt="Profile Picture" class="profile-pic" />
    <p class="greeting">Hi, ${data.firstname} ${data.lastname}</p>
    <p class="role">Freelancer</p>
  `;

  Freelancer_info.appendChild(FreelancerProfile);
};

fetchinfo(); // Call the function when the script loads
