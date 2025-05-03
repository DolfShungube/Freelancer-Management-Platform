import supabase from '../config/superbaseClient.js';

// Fetch user data and populate the fields
const fetchUserNames = async () => {
  const firstnameDisplay = document.getElementById('firstname-display');
  const lastnameDisplay = document.getElementById('lastname-display');
  const firstnameInput = document.getElementById('firstname-input');
  const lastnameInput = document.getElementById('lastname-input');

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    firstnameDisplay.textContent = 'First Name: Not logged in';
    lastnameDisplay.textContent = 'Last Name: Not logged in';
    console.error(authError);
    return;
  }

  // Fetch names from the 'Freelancer' table
  const { data, error } = await supabase
    .from('Freelancer')
    .select('firstname, lastname')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    firstnameDisplay.textContent = 'First Name: Not found';
    lastnameDisplay.textContent = 'Last Name: Not found';
    console.error(error);
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
    // Update in Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('User not authenticated');
      return;
    }

    const updateData = {};
    updateData[field] = input.value;

    const { error } = await supabase
      .from('Freelancer')
      .update(updateData)
      .eq('id', user.id);

    if (error) {
      console.error(`Failed to update ${field}:`, error);
      return;
    }

    // Update frontend display
    display.textContent = `${field.charAt(0).toUpperCase() + field.slice(1)}: ${input.value}`;
    input.classList.add('hidden');
  }
};

// Call on load
fetchUserNames();
