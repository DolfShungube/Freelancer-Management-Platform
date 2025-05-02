import supabase  from "../config/superbaseClient.js";


// Function to toggle the input field for editing
window.toggleEdit = function(field) {
  const p = document.getElementById(`${field}-display`);
  const input = document.getElementById(`${field}-input`);
  const button = p.nextElementSibling.nextElementSibling || p.nextElementSibling;

  if (input.classList.contains('hidden')) {
    // Extract the text after the colon
    const currentText = p.textContent.split(':')[1].trim();
    input.value = currentText;
    p.classList.add('hidden');
    input.classList.remove('hidden');
    button.textContent = 'Save';
  } else {
    // Update the <p> text with the new input value
    const label = p.textContent.split(':')[0];
    const newValue = field === 'password' ? '********' : input.value;
    p.textContent = `${label}: ${newValue}`;
    input.classList.add('hidden');
    p.classList.remove('hidden');
    button.textContent = field === 'name' ? 'Edit' : field === 'email' ? 'Change' : 'Reset';
    
    // Update profile in Supabase
    updateProfile(field, newValue);
  }
};

// Function to update user profile data in Supabase
async function updateProfile(field, value) {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user.id;

  const { error } = await supabase
    .from('Freelancer')
    .update({ [field]: value })
    .eq('id', userId);

  if (error) {
    console.error("Update failed:", error);
  } else {
    console.log(`${field} updated to ${value}`);
  }
}
