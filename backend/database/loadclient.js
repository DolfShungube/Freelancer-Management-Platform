import { addNewJob,addNewPayment,userProfile,clientJobs, viewJobs, getPayment } from "./utils.js";
import supabase from "../config/superbaseClient.js";



const userName= document.getElementById('userName')



export async function loaduser(userType){
   let issue=''
    try {

        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        
        if(user){
            //userName.innerText(user.userfname)
            console.log("dolf is in")
            const id= user.id
            const profile= await userProfile(id,'Client')
            console.log(profile[0])
            userName.innerText=profile[0].firstname+" "+profile[0].lastname

            const jobs= await clientJobs(id)
            //const Payments= await getPayment()
           //const  freelancer
           console.log(jobs)
            viewJobs(jobs)


        }else{
            issue='could not load your details'
        }
        
    } catch (error) {
        console.log(error)
        
    }

}
const user=loaduser('Client')




const addjob= document.getElementById('addJob')

addjob.addEventListener('click',async (e)=>{
    window.location.href = 'Addjob.html';
})










// export async function loadjobs(userid){
//     const issue=''
//      try {

//         const jobs= await clientJobs(userid)    
         
         
//      } catch (error) {
//          console.log(error)
         
//      }
 
//  }






