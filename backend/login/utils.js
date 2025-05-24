
import {supabase} from '../config/superbaseClient.js'
 export function getDetails(){
    const details={userType:"",email:"",password:""}

        details.userType= document.getElementById("accountType");
        details.email= document.getElementById("email")
        details.password=  document.getElementById("password");

    return details
}


export function getDetailValues(){
    const details={userType:"",email:"",password:""}

        details.userType= document.getElementById("accountType").value;
        details.email= document.getElementById("email").value;
        details.password= document.getElementById("password").value; 
    return details
}





export function registrationDetailsPresent(details){

        if(Object.values(details).includes('')){
           return false
        }

    return true

}

export function existingEmail(email){

    if(email!=''){
        return true;
        
    }

    return false;

}


export function issueTracker(details,detailValues){
    let issues=[]

    if(!registrationDetailsPresent(detailValues)){
    issues.push("please fill in all the required details")
    }else{
        
    }

    return issues


}


export async function handleUserInput(detailValues){
    const value=''
    
    try {

        const {data,error} = await supabase.auth.signInWithPassword({
            email: detailValues.email,
            password: detailValues.password
           })


           if (error){
               return error.message
               }else{

                const user = data.user;
                try {
                    const { data: Account,error: accountError } = await supabase
                    .from(detailValues.userType) 
                    .select('id')
                    .eq('id', user.id)
                    .single();

                
                if(accountError){
                    return "you are not registered for the selected account Type"
                     
                }
                return value   

                    
                } catch (error) {
                   
                    return error.message    
                    
                }

               }
        
    } catch (error) {
       return error.message
        
    }


 }

 export function showAlert(message, type = 'info') {
    Swal.fire({
        title: type === 'success' ? 'Success!' : 'Oops!',
        text: message,
        icon: type,  // 'success', 'error', 'warning', 'info'
        confirmButtonText: 'OK'
    });
}

export function mainIcon(){



    const item2=document.getElementById("logout")
  

 

    item2.addEventListener('click',async(e)=>{
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            window.location.replace('./login.html');
          } catch (error) {
            showAlert(error.message, 'error');
          }
        })


}








