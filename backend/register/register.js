import { validateInputs, registerUser } from './register_functions.js';

document.addEventListener("DOMContentLoaded", function() {
    const usersMap = new Map();  
    const usertype = document.getElementById("AccountType");  
    const form = document.getElementById("form");  

    let selectedtype = null;

    
    usertype.addEventListener("change", function() {
        selectedtype = usertype.value;
        console.log("Selected account type:", selectedtype);
    });

    function showAlert(message, type = 'info') {
        Swal.fire({
            title: type === 'success' ? 'Success!' : 'Oops!',
            text: message,
            icon: type,  // 'success', 'error', 'warning', 'info'
            confirmButtonText: 'OK'
        });
    }


    
    form.addEventListener("submit", async function(event) {
        event.preventDefault(); 

        
        const firstname = document.getElementById("firstname").value;
        const lastname = document.getElementById("lastname").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const password2 = document.getElementById("password2").value;
        const registerBtn = document.getElementById("Register");
        
        
        const validationMessage = validateInputs(firstname, lastname, email, password, password2, selectedtype);
        if(validationMessage){
            showAlert(validationMessage,'error')
        }


        
       registerBtn.disabled = true;
        registerBtn.innerText = "Loading..."; 

        const registerUserMessage = await registerUser(firstname, lastname, email, password, selectedtype);

        registerBtn.disabled = false;
        registerBtn.innerText = "Register";

        
      
        if(registerUserMessage === "User Registered"){
            form.reset();
            Swal.fire({
                title:'Success!',
                text: 'Registration successful',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(()=>{
                window.location.href = "./login.html";
            });
            console.log("User Registered", usersMap);
            return usersMap;
        }else{
            showAlert(registerUserMessage, 'error');
            // window.location.href = "login.html";   
        }

        
    });
});

