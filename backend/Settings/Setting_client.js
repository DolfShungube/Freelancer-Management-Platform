import supabase from '../config/superbaseClient.js';

// Fetch user data and populate the fields
const fetchUserNames = async () => {
  const firstnameDisplay = document.getElementById('firstname-display');
  const lastnameDisplay = document.getElementById('lastname-display');
  const firstnameInput = document.getElementById('firstname-input');
  const lastnameInput = document.getElementById('lastname-input');

  // Get current user
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    firstnameDisplay.textContent = 'First Name: Not logged in';
    lastnameDisplay.textContent = 'Last Name: Not logged in';
    console.error('Auth error:', authError);
    return;
  }

  const user = userData.user;


  // Fetch names from the 'Client' table using 'user_id'
  const { data, error } = await supabase
    .from('Client')
    .select('firstname, lastname')
    .eq('id', user.id) // <-- use user_id instead of id
    .maybeSingle();

  if (error || !data) {
    
    firstnameDisplay.textContent = 'First Name: Not found';
    lastnameDisplay.textContent = 'Last Name: Not found';
    console.error('Fetch error:', error);
    return;
  }

  // Set display and input values
  firstnameDisplay.textContent = `First Name: ${data.firstname}`;
  lastnameDisplay.textContent = `Last Name: ${data.lastname}`;
  firstnameInput.value = data.firstname;
  lastnameInput.value = data.lastname;
};

// Toggle edit mode and update name
window.toggleEdit = async (field) => {
  const display = document.getElementById(`${field}-display`);
  const input = document.getElementById(`${field}-input`);

  // If input is hidden, show it
  if (input.classList.contains('hidden')) {
    input.classList.remove('hidden');
    input.focus();
  } else {
    // Get current user
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError || !userData?.user) {
      console.error('User not authenticated:', authError);
      return;
    }

    const user = userData.user;


    const updateData = {};
    updateData[field] = input.value;
    
    console.log(user.id);
    const { error: updateError } = await supabase
      .from('Client')
      .update(updateData)
      .eq('id', user.id); // <-- use user_id instead of id

      console.log('Updated:', updateData);

    if (updateError) {
      console.error(`Failed to update ${field}:`, updateError);
      return;
    }

    // Update frontend display
    display.textContent = `${field.charAt(0).toUpperCase() + field.slice(1)}: ${input.value}`;
    input.classList.add('hidden');
  }
};

// Call on load
fetchUserNames();


