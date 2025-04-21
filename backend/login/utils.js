 import supabase from '../config/superbaseClient.js';
import superbase from '../config/superbaseClient.js'
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

        const {data,error} = await superbase.auth.signInWithPassword({
            email: detailValues.email,
            password: detailValues.password
           })


           if (error){
               return error.message
               }else{

                const user = data.user;
                try {
                    const { data: Account,error: accountError } = await superbase
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

    document.addEventListener('click', (e) => {
        const isClickInsideDropdown = details.contains(e.target);
        const isClickOnIcon = icon.contains(e.target);
      
        if (!isClickInsideDropdown && !isClickOnIcon) {
          details.classList.add('hidden');
        }
      })

    const details=document.createElement('section')
          details.id="dropdowmmenu"
          details.className = "dropdown hidden";


    const list=document.createElement("ul")

    const item1=document.createElement("li")
            item1.id="reportissue"
            item1.textContent="Report issue"
    const item2=document.createElement("li")
            item2.id="logout"
            item2.textContent="Logout"

    //details.append(list,item1,item2)
    list.append(item1,item2)
    details.appendChild(list)
    document.body.appendChild(details);


    item1.addEventListener('click',async(e)=>{
        showAlert("the report issue function is currently offline","error")
    })

    item2.addEventListener('click',async(e)=>{
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            window.location.replace('./login.html');
          } catch (error) {
            showAlert(error.message, 'error');
          }
        })


        const icon = document.getElementById("menu-icon");
        icon.addEventListener('click', () => {
            const iconRect = icon.getBoundingClientRect();
            details.style.position = "absolute";
            details.style.top = `${iconRect.bottom + window.scrollY}px`;
            details.style.left = `${iconRect.left + window.scrollX-70}px`;
            details.classList.toggle('hidden');         

  });

    
    
        // const details=document.createElement('select');
        // details.id = "menu";
        // details.style.position ='absolute'
        // details.style.top = '50px'
        // details.style.right = '10px'

        // const defaultOption = document.createElement('option');
        // defaultOption.text = '-- Menu --';
        // defaultOption.disabled = true;
        // defaultOption.selected = true;

        // const report=document.createElement('option');
        // report.value="Issue"
        // report.text="Report issue"
        // const logout=document.createElement('option');
        // logout.value="logout"
        // logout.text="Logout"

        // details.append(defaultOption,report,logout)
        // document.body.appendChild(details)

        // document.getElementById("logout").addEventListener('click', async () => {
        //     try {
        //       const { error } = await supabase.auth.signOut();
        //       if (error) throw error;
        //       window.location.replace('./login.html');
        //     } catch (error) {
        //       showAlert(error.message, 'error');
        //     }
        //   });


        // details.addEventListener('change', async(e)=>{

        //     const selected = e.target.value;

        //     if (selected === "logout") {
        //         try {
        //             const { error } = await supabase.auth.signOut();
        //             if (error){
        //                 showAlert(error.message, 'error');
        //                 return

        //             };
        //             window.location.replace('./login.html');
        //         } catch (error) {
        //             showAlert(error.message, 'error');
                    
        //         }
        //     }
        //     else if(selected === "Issue"){

        //         showAlert("the report issue function is currently offline","error")


        //     }
        //     details.remove();



        // })


// })


}








