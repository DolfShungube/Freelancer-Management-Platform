import {Aplications} from './Utils.js'
import supabase from "../config/superbaseClient.js";


const jobName= localStorage.getItem('jobName')
document.getElementById('jobtitle').textContent=jobName
const jobID = localStorage.getItem('jobID');
document.getElementById('job-id').textContent=jobID
const jobDescription = localStorage.getItem('jobDescription');
document.getElementById('description-text').textContent=jobDescription
const assignedFreelancer= localStorage.getItem('assignedFreelancer') //freelancerid
const client= localStorage.getItem('client') //client id

async function getAplications(jobID) {
    //get all aplications for the job

    try {
        const { data: aplications, error } = await supabase
        .from('Aplications')
        .select('*')
        .eq('jobID', jobID)
        .is('status', null);


        if(error){
            console.log(error)
          //  this.showAlert(error.message,'error');
            return
        }

        console.log(aplications)
        console.log('dolf')
        return aplications


    } catch (error) {
        console.log(error.massage)
       // this.showAlert(error.message,'error');
        return
        
    }

 
}


const Allaplications= await getAplications(jobID)

if(Allaplications.length==0){
    const allapliactions2= document.getElementById('myAplicants')

    // no one has aplied for the job or current aplicants were rejected
    const name= document.createElement('p')
    name.textContent= "you have no aplicants "
    const list= document.createElement('li');
    list.appendChild(name)
    allapliactions2.appendChild(list)

}else{


Allaplications.forEach(async data => {
    const aplication= new Aplications(data.freelancerID,jobID);
    const freelancer= await aplication.getFreelancer()

    const freelancerName= freelancer[0].firstname+" "+freelancer[0].lastname
    const beginAplication= await aplication.newAplication(freelancerName)

})
}



//add chat info here






   









