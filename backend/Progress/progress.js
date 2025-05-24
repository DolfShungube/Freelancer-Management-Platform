const jobID=localStorage.getItem('jobID')
const jobName=localStorage.getItem('jobName')
const jobDescription=localStorage.getItem('jobDescription')
const assignedFreelancerID=localStorage.getItem('assignedFreelancer')
const clientID=localStorage.getItem('client')
const userType= localStorage.getItem('userType')
console.log(clientID)
// const jobstring= localStorage.getItem('job')
// const job=JSON.parse(jobstring)
const addTask= document.getElementById('addTask');



document.getElementById('addTask').style.display = 'block';
if(userType==='Client'){
    addTask.style.display = 'none';  
}


import {supabase} from "../config/superbaseClient.js"
import { Progress } from "./Utils.js"




const progress= new Progress(clientID,assignedFreelancerID,jobID)

const job= await progress.getJob()
let pretasks=  await progress.getTask(job);

const tasks= progress.normalizeTasks(pretasks)



const totalTasks= progress.getTotalTask(tasks);

const completedTasks=progress.getCompletedTasks(tasks)

const incompleteTasks= progress.getInCompletedTasks(tasks)

const totalCompletedTasks=completedTasks.length
console.log(totalCompletedTasks)

const graphID=document.getElementById('taskDonutChart').getContext('2d');
const completedTasksGraph= progress.completedTasksGraph(totalTasks,totalCompletedTasks,graphID)
console.log(completedTasksGraph)

document.getElementById('jobtitle').innerText=jobName
document.getElementById('description-text').innerText=jobDescription

document.getElementById('total-tasks').innerText=totalTasks
document.getElementById('completed-tasks').innerText=totalCompletedTasks


const addTasks= document.getElementById('myTask');

 incompleteTasks.forEach(task=>{
    progress.taskStructure(addTasks,task[0],task[1],task[2])
})


completedTasks.forEach(task=>{
    progress.taskStructure(addTasks,task[0],task[1],task[2])
})


const updatedTasks= await progress.serverListener(completedTasksGraph)









addTask.addEventListener('click',(e)=>{

    const textbox=document.getElementById('myNewTask')
    addTask.style.display = 'none';
    textbox.style.display = 'block';
    
    const add=document.getElementById('addtext')
    add.style.display = 'block';
    add.addEventListener('click',(e)=>{

        const Thetext= textbox.value
        textbox.value=''
        if(Thetext===''){
                   add.disabled=true;     
            progress.showAlert('you have not added a task!!','error')

        }else{
        progress.addTask(Thetext)
        }

    textbox.style.display = 'none';
    add.style.display = 'none';
    add.disabled=false;
    addTask.style.display = 'block';

    })

})

  const conView= document.getElementById('conView')
  const conViewDropdown= document.getElementById('conViewDropdown')

  conView.addEventListener('click',async(e)=>{
     progress.dropDownstatusContract(conView,conViewDropdown,userType)
  })

  const call= document.getElementById('call')
    console.log('goin free',userType,clientID)
  call.addEventListener('click',(e)=>{
  if(userType==='Client'){


    window.location.href = `chatbox.html?freelancerID=${assignedFreelancerID}`;
  }else{
    console.log(' a free')
    window.location.href = `chatbox.html?clientID=${clientID}`;



  }

  })




























