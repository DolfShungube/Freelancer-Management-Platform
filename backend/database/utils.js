import superbase from '../config/superbaseClient.js'

export async function addNewJob(clientID,projectName,projectDescription,amount){

    let issue=''

    try {

        const {data,error}= await superbase
            .from('Jobs')
            .insert([
                {clientID: clientID,jobName: projectName,description: projectDescription,assigned:false}
                     ])
            .select()

        if(error){
            issue=error.message
            console.log(issue)
            return issue
        }else{
            console.log("dolf is done")  
            console.log(data[0].id)         
            issue = addNewPayment(data[0].id,amount)

            return issue
        }

        
    } catch (error) {

        issue=error.message
        console.log(issue)
        return issue
        
    }


}


export async function addNewPayment(jobID,amount) {
    let issue=''
    try{
            
        const {data,error}= await superbase
            .from('Payments')
            .insert([
                {jobID:jobID,amount:amount,status:false}
            ])

            if(error){
                issue=error.message
                console.log(issue+" from nepay")
                return issue
            }else{
                console.log(issue+" from nepaynoissue")
                return issue
            }




        
    } catch (error) {

        issue=error.message
 console.log(issue+" from nepaycatch")
    }
    
}


export async function userProfile(userID,userType){
   const issue=''
    try{
            
        const {data,error}= await superbase
            .from(userType)
            .select('*')
            .eq('id',userID)

            if(error){
                issue=error.message
                return issue
            }else{
                return data
            }


        
    } catch (error) {
        issue=error.message
        
    }
    
}


export async function clientJobs(userID) {
    let issue=''
    try{
            
        const {data,error}= await superbase
            .from('Jobs')
            .select('*')
            .eq('clientID', userID) 

            if(error){
                issue=error.message
                return issue
            }else{
                return data
            }


        
    } catch (error) {
        issue=error.message
        
    }
    
}

export async function getFreelancer(userID) {
    let issue=''
    try{
            
        const {data,error}= await superbase
            .from('Freelancer')
            .select('*')
            .eq('id', userID) 

            if(error){
                issue=error.message
                return issue
            }else{
                return data
            }


        
    } catch (error) {
        issue=error.message
        
    }
    
}

export async function getPayment(userID) {
    let issue=''
    try{
            
        const {data,error}= await superbase
            .from('Payments')
            .select('*')
            .eq('jobID', userID) 

            if(error){
                issue=error.message
                return issue
            }else{
                return data
            }


        
    } catch (error) {
        issue=error.message
        
    }
    
}


{/* <p>Status: <span class="progress-label">${job.status}</span></p>
<progress value="${job.progress}" max="100"></progress> */}


export async function  viewJobs(jobs) {
    const jobList= document.getElementById('joblist')
    const activeJobList=document.getElementById('active-jobs')
    jobList.innerHTML = '';
    if (!jobs || jobs.length === 0) {
        jobList.innerHTML ='<p>you have not posted any jobs.</p>';
        return;
      }

    jobs.forEach(async job => {
        const freelancer= await getFreelancer(job.freelancerID)
        const cost= await getPayment(job.id)

        let AssignedFreelancer='None'
        let amount='Missing'

        if(freelancer.length!=0){
            AssignedFreelancer= freelancer[0].firstname+" "+freelancer[0].lastname
        }

        if(cost.length!=0){
            amount=cost[0].amount

        }


        const list = document.createElement('li');
        const form = document.createElement('form');
        form.className = 'job-card';

        const jobname = document.createElement('h3');
        jobname.textContent = job.jobName;

        const showdetails = document.createElement('button');
        showdetails.type = 'button';
        showdetails.textContent = 'Details';

        const details=document.createElement('section');
        details.style.display='none';
    details.innerHTML = `
        <section>
         <h3>Description:</h3>
        <p>${job.description}</p>
      </section>
       
      <section>
            <h3>Progress:</h3>
            <progress value="${job.progress || 0}" max="100"></progress>
      
      </section>

      <section>
         <h3>Cost:${amount}</h3>
      </section>

      <section>
      <h3>Assigned freelancer:</h3>
      <p>${AssignedFreelancer} </p>

      </section>

    `
    showdetails.addEventListener('click', () => {
        console.log(job,"from load")
        if(job.assigned===true){

            // go to page to view progres
            localStorage.setItem('jobID', job.id);
            localStorage.setItem('jobName',job.jobName)
            localStorage.setItem('jobDescription',job.description)
            localStorage.setItem('assignedFreelancer',job.freelancerID)
            localStorage.setItem('client',job.clientID)
            localStorage.setItem('job',JSON.stringify(job))
            
            localStorage.setItem('userType','Client')
            

            window.location.href = './progress.html'; 
            
            // const showing = details.style.display === 'block';
            // details.style.display = showing ? 'none' : 'block';
            // showdetails.textContent = showing ? 'Details' : 'Less';

        }else{
            localStorage.setItem('jobID', job.id);
            localStorage.setItem('jobName',job.jobName)
            localStorage.setItem('jobDescription',job.description)
            localStorage.setItem('assignedFreelancer',job.freelancerID)
            localStorage.setItem('client',job.clientID)

            //go to aplications
            window.location.href = './Aplication.html';   

        }
      })

      form.append(jobname, showdetails, details);
      list.appendChild(form);
           if(job.assigned!=true){
              jobList.appendChild(list)
      }else{
        activeJobList.appendChild(list)
      }
        
    });

    console.log("done")
    
}




