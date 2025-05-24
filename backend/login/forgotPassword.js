
import {showAlert} from "./utils.js"
import {supabase} from "../config/superbaseClient.js"

const form= document.getElementById('form')

form.addEventListener('submit',async (e)=>{
     e.preventDefault()   
    const email= document.getElementById("email").value
    localStorage.setItem("resetEemail", email);


        try {
            let { data, error } = await supabase.auth.resetPasswordForEmail(email,{
                redirectTo: `https://victorious-tree-0efc89c00.6.azurestaticapps.net/frontend/src/pages/newPass.html`
            });
        if(error){
            showAlert(error.message,"error")   

        }else{
            showAlert("check your emails for reset link",'success') 

        setTimeout(() => {
             window.location.replace('./login.html')
        }, 2000);

            

        }

        } catch (error) {
    
            showAlert(error.message,'error')
            
        }






})



