import supabase from '../config/superbaseClient.js';

const fetchinfo = async () => {
  const Freelancer_info = document.querySelector('.profile-info');
  const {data:{user},error:authError} = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('Freelancer')
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) {
    Freelancer_info.innerHTML = '<p>Could not find profile.</p>';
    console.error(error);
    return;
  }

  if (data.length === 0) {
    Freelancer_info.innerHTML = '<p>Profile details are not available.</p>';
    return;
  }

  // Clear any existing content
  Freelancer_info.innerHTML = '';

  data.forEach(freelancer => {
    const FreelancerProfile = document.createElement('section');
    FreelancerProfile.classList.add('profile-text');

    FreelancerProfile.innerHTML = `
    <img src="${freelancer.profilepicture}" alt="Profile Picture" class="profile-pic" />
      <p class="greeting">Hi, ${freelancer.firstname} ${freelancer.lastname}</p>
      <p class="role">Freelancer</p>
    `;

    Freelancer_info.appendChild(FreelancerProfile);
  });
};

fetchinfo(); // Call the function when the script loads
