
import supabase from "../config/superbaseClient.js";
import { showAlert } from "./utils.js";

const logOut= document.getElementById("logOut");

logOut.addEventListener('click', async (e)=>{ 

    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        window.location.replace('./login.html');
    } catch (error) {
        showAlert(error.message,'error');
    }
       

})