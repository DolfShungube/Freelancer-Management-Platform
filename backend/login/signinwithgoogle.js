import {supabase} from "../config/superbaseClient.js";
import { showAlert } from "./utils.js";
const googleButton= document.getElementById('SignInWithGoogle');



googleButton.addEventListener("click", async () => {

const selectedtype= document.getElementById("accountType").value;

if(selectedtype===""){

  showAlert("please select an account Type to proceed","error")

}
else if(selectedtype==="Admin"){

    showAlert("Admins can only use email sign in","error")
  

}

else{
  signIn(selectedtype)
}



 });


 async function  signIn(account) {
  


    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {

        redirectTo: `https://victorious-tree-0efc89c00.6.azurestaticapps.net/frontend/src/pages/${account}.html`

      }
    });

  


    if (error) {
      showAlert(error.message, 'error');
    }
 
  }
