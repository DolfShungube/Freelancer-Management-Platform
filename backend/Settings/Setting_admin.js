import {supabase} from '../config/superbaseClient.js';

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

  // Fetch names via RPC
  const { data, error } = await supabase.rpc('get_admin_name', {
    admin_id: user.id,
  });

  if (error || !data || data.length === 0) {
    firstnameDisplay.textContent = 'First Name: Not found';
    lastnameDisplay.textContent = 'Last Name: Not found';
    console.error('Fetch error:', error);
    return;
  }

  const { firstname, lastname } = data[0];

  // Set display and input values
  firstnameDisplay.textContent = `First Name: ${firstname}`;
  lastnameDisplay.textContent = `Last Name: ${lastname}`;
  firstnameInput.value = firstname;
  lastnameInput.value = lastname;
};

// Toggle edit mode and update name using RPC
window.toggleEdit = async (field) => {
  const display = document.getElementById(`${field}-display`);
  const input = document.getElementById(`${field}-input`);

  if (input.classList.contains('hidden')) {
    input.classList.remove('hidden');
    input.focus();
  } else {
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
      console.error('User not authenticated:', authError);
      return;
    }

    const user = userData.user;

    const updatePayload = {
      admin_id: user.id,
      new_firstname: null,
      new_lastname: null,
    };

    // Only update the edited field
    updatePayload[`new_${field}`] = input.value;

    const { error: rpcError } = await supabase.rpc('update_admin_name', updatePayload);

    if (rpcError) {
      console.error(`Failed to update ${field}:`, rpcError);
      alert('Failed to update. Please try again.');
      return;
    }

    // Update frontend display
    display.textContent = `${field.charAt(0).toUpperCase() + field.slice(1)}: ${input.value}`;
    input.classList.add('hidden');
  }
};

// Call on load
fetchUserNames();
