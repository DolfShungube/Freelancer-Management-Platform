import {supabase} from '../config/superbaseClient.js'

import {progressReport}  from '../progressReport/Utils.js'

export async function addNewJob(clientID,projectName,projectDescription,amount){

    let issue=''

    try {

        const {data,error}= await supabase
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
            
        const {data,error}= await supabase
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
   let issue=''
    try{
            
        const {data,error}= await supabase
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

export async function aplicantCount(jobID){
   let issue=''
    try{
            
        const {data,error}= await supabase
            .from("Aplications")
            .select('*')
            .eq('jobID',jobID)

            if(error){
                issue=error.message
                return issue
            }else{
                return data.length
            }


        
    } catch (error) {
        issue=error.message
        
    }
    
}

export function progressCalculator(totalTasks,completedTasks){

    if(totalTasks===0){
        return 0
    }
    
    
    return (completedTasks/totalTasks)*100

}











export async function clientJobs(userID) {
    let issue=''
    try{
            
        const {data,error}= await supabase
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
            
        const {data,error}= await supabase
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
            
        const {data,error}= await supabase
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

    let openJobs=0;
    let JobsInaplication=0;
    let jobsInprogress=0;

    const jobList= document.getElementById('joblist')
    const activeJobList=document.getElementById('active-jobs')
    jobList.innerHTML = '';
    if (!jobs || jobs.length === 0) {
        jobList.innerHTML ='<p>you have not posted any jobs.</p>';
        return;
      }

     await jobs.forEach(async (job,index) => {
        const freelancer= await getFreelancer(job.freelancerID)


        const list = document.createElement('li');
        const form = document.createElement('form');
        form.className = 'job-card';

        const jobname = document.createElement('h4');
        const sometext=job.jobName
        jobname.textContent = sometext.length > 10 ? sometext.slice(0, 10) + "..." : sometext;
        

        const showdetails = document.createElement('button');
        showdetails.type = 'button';
        showdetails.textContent = 'Details';

        const details=document.createElement('section');
        details.style.display='none';
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

             let aplicants = document.createElement('section')
             const total= await aplicantCount(job.id)
             if(total===0){
                openJobs+=1

             }else{
                JobsInaplication+=1

             }
             aplicants.innerHTML=`
                     <section>
                    <h6>Aplicants:${total}</h6>
                    </section>
             
             `
             form.appendChild(aplicants)
              jobList.appendChild(list)
      }else{
            jobsInprogress+=1

            const progress= new progressReport()
            const alltasks= await progress.getTasks(job.id)
            const completedTasks= await progress.getCompletedTasks(alltasks)

            const countTotal= alltasks.length
            const countcomplete= completedTasks.length
             let aplicants = document.createElement('section')
             const total= await aplicantCount(job.id)
             aplicants.innerHTML=`
                     <section>
                    <h6>Progress:${progressCalculator(countTotal,countcomplete)}%</h6>
                    </section>
             
             `
             form.appendChild(aplicants)
            activeJobList.appendChild(list)
      }

      if(index=== jobs.length-1){
                mystats(openJobs,JobsInaplication,jobsInprogress) 
      }

    
    });

    console.log("done")
    
}


export function mystats(open,aplication,assigned){
const ctx = document.getElementById('taskDonutChart').getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Open', 'Aplication stage', 'Assigned'],
          datasets: [{
            data: [open, aplication, assigned],
            backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
            borderWidth: 2
          }]
        },
        options: {
          cutout: '60%', // Controls the hole size
          plugins: {
            legend: {
      position: 'right', // <- Move legend to the right
      labels: {
        color: '#580cd1',
        boxWidth: 20,
        padding: 20
      }
    },

            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || '';
                  let value = context.parsed;
                  let total = context.chart._metasets[context.datasetIndex].total;
                  let percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });

    }









