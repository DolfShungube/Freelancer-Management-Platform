
import {showAlert} from "./utils.js"
import supabase from "../config/superbaseClient.js"

const form= document.getElementById('form')


form.addEventListener('submit',async (e)=>{
     e.preventDefault()   
    const email= document.getElementById("email").value
    localStorage.setItem("resetEemail", email);


 
  

        try {
            let { data, error } = await supabase.auth.resetPasswordForEmail(email);
        if(error){
            showAlert(error.message,"error")   

        }else{
            showAlert("check your emails for reset link",'success') 

        }

        } catch (error) {
    
            showAlert(error.message,'error')
            
        }

     window.location.href = `newPass.html?email=${encodeURIComponent(email)}`;

    window.location.replace('./login.html')



})




