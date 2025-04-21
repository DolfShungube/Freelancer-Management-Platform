// Import necessary packages
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from the .env file
dotenv.config();

// Create a Supabase client with Service Role Key
const supabase = createClient(
  process.env.SUPABASE_URL,  // Supabase URL
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service Role Key
);

// Function to delete a user by their user ID
async function deleteUser(userId) {
  try {
    // Deleting the user
    const { data, error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error deleting user:', error);
    } else {
      console.log('User deleted successfully:', data);
    }
  } catch (error) {
    console.error('Error in deleteUser function:', error);
  }
}

// Example: Delete a user with user ID 'some-user-id'
deleteUser('some-user-id');
