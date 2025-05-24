import {showAlert} from "./utils.js"
import {supabase} from "../config/superbaseClient.js"

const form= document.getElementById('form')



  async function handleSession() {
    const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
    if (error) {
      console.error('Error exchanging code for session:', error);

    } else {
      console.log('Session established:', data);

    }
  }

 await handleSession();




 
form.addEventListener('submit',async (e)=>{
   const password2=document.getElementById('password').value
    const email2 = localStorage.getItem("resetEmail");
    e.preventDefault()

  
        try {

            let { data, error } = await supabase.auth.updateUser({
                email:email2,
                password:password2
            });

        if(error){
            showAlert(error.message,"error")   

        }else{
            showAlert("complete",'success') 
                  setTimeout(() => {
             window.location.replace('./login.html')
        }, 2000);

        }

        } catch (error) {
    
            showAlert(error.message,'error')
            
        }
   //    window.location.replace('./login.html')



})
