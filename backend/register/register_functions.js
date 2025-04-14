import supabase  from "../config/superbaseClient.js";
import {showAlert} from '../login/utils.js'

function validateInputs(firstname, lastname, email, password, password2, selectedtype) {
    if (!firstname || !lastname || !email || !password || !password2 || !selectedtype) {
        return "Ensure you provide all necessary information.";
    }
    if (password !== password2) {
        return "Passwords do not match! Please re-check";
    }
    if(password.length<6){
        return "Passord is too short make at least it 6 words in length"
    }
    return null; 
}

// change this one to insert user in the database and create user
async function registerUser(firstname, lastname, email, password, selectedtype) {
    console.log(firstname,lastname,email,selectedtype)


  

    //creating a new user
    const {data:authData,error: signUpError} = await supabase.auth.signUp({

        email:email,
        password:password,
        options: {
            data: {
              firstname:firstname,
              lastname:lastname,
              table: selectedtype
            }
          }
    });

    if(signUpError){

        return;
    }else{
        return "User Registered"
    }
 
    
}

export  { validateInputs, registerUser };