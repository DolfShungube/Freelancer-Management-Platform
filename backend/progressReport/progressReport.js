import { progressReport} from "./Utils.js";


const jobID= localStorage.getItem('jobID')



const Report = new progressReport()


const Tasks=  await Report.getTasks(jobID);

if(!Array.isArray(Tasks)){
    Report.showAlert(Tasks,'error')

}else{

const completedTasks= await Report.getCompletedTasks(Tasks);


const totalCompletedTasks=completedTasks.length

const totalTasks= Tasks.length


const startDate= Report.getStartDate(Tasks)
const graphDates=   Report.getDates(startDate)
//console.log(graphDates)

const taskTracking=[]; // stores the number of incomplete tasks for a specific day
const completeTaskTracking=[];



graphDates.forEach(date=>{
    const nTask= Report.incompletedTasksByDate(Tasks,date)
    const nTaskCompleted=Report.completedTasksByDate(Tasks,date)
    taskTracking.push(nTask)
    completeTaskTracking.push(nTaskCompleted)

})


const monthAndDate= graphDates.map(date=>{
   const month =(date.getMonth()+1).toString().padStart(2,'0')
  const day =date.getDate().toString().padStart(2,'0')
  return `${month}-${day}`
})

const lineChartid =document.getElementById("lineChart")
const dchart= document.getElementById('taskDonutChart')
const totalTasksid= document.getElementById("total-tasks")
const completeTasks= document.getElementById("completed-tasks")

Report.linegraph(monthAndDate,taskTracking,completeTaskTracking, lineChartid)
Report.donutGraph(totalTasks,totalCompletedTasks,dchart)
totalTasksid.innerText=Tasks.length
completeTasks.innerText=completedTasks.length



const docButton= document.getElementById('docButton')

docButton.addEventListener('click',(e)=>{
    const doc= document.getElementById('doc')
    Report.generatePDF(doc)

})

}






