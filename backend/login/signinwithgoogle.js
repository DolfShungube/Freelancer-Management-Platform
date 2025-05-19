import supabase from "../config/superbaseClient.js";
import { showAlert } from "./utils.js";
const googleButton= document.getElementById('SignInWithGoogle');



googleButton.addEventListener("click", async () => {

const selectedtype= document.getElementById('accountType').value;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {

       // redirectTo: 'http://localhost:5500/frontend/src/pages/Client.html'
        redirectTo: `https://victorious-tree-0efc89c00.6.azurestaticapps.net/frontend/src/pages/Client.html`


      }
    });

    showAlert('done','success')



//     const { data: { user } } = await supabase.auth.getUser();

//     const { data2, error2 } = await supabase
//   .from('profiles')
//   .upsert({
//     id: user.id,
//     fullname: user.user_metadata.full_name,
//     username: user.email.split('@')[0],

//   });


    if (error) {
      showAlert(error.message, 'error');
    }
  });
