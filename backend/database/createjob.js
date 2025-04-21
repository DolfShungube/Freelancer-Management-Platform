
import { addNewJob,addNewPayment,userProfile,clientJobs } from "./utils.js";
import supabase from "../config/superbaseClient.js";



const add= document.getElementById('add')


export async function NewJob(name,description,amount) {
    let issue='';

    try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        
        if(user){
            //userName.innerText(user.userfname)
            console.log("dolf is in")
            const id= user.id
            const p= await addNewJob(id,name,description,amount)
            console.log("still in")

        }else{
            issue='could not create job'
        }
    } catch (error) {

        console.log(error.message)
        
    }
    
} 

add.addEventListener('submit',async (e)=>{

    const name= document.getElementById("project-name").value
    const description=document.getElementById("project-description").value
    const amount= document.getElementById('amount').value

    e.preventDefault()
    console.log(amount+" amountnow")
    const job=  await NewJob(name,description,amount);
    window.location.href = 'Client.html';
    console.log(job)


})