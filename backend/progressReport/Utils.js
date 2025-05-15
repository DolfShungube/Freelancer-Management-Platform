
import supabase from "../config/superbaseClient.js";
export class progressReport{

 constructor(){

 }


        showAlert(message, type = 'info') {
        Swal.fire({
            title: type === 'success' ? 'Success!' : 'Oops!',
            text: message,
            icon: type,  // 'success', 'error', 'warning', 'info'
            confirmButtonText: 'OK'
        });
    }


 async getTasks(jobID){
 

    try {
        const {data,error}= await supabase 
        .rpc('gettasks', { job_id: jobID });

        if(error){
            return error.message
        }else{
            return data
        }
    } catch (error) {

        return error.message
        
    }

 }

 getCompletedTasks(Tasks){
    const completedTasks = Tasks.filter(task => task.status === true);
    return completedTasks

 }

 getInCompletedTasks(Tasks){
    const completedTasks = Tasks.filter(task => task.status === false);
    return completedTasks

 }




 incompletedTasksByDate(Tasks,date){
  let total=0;
   date=date.setHours(0, 0, 0, 0)



    const incompletedTasks = Tasks.filter(task =>{
        let taskCompletionDate= null
        const creationDate=new Date(task.created_at).setHours(0, 0, 0, 0)
        if(task.Completion){
          taskCompletionDate=new Date(task.Completion).setHours(0, 0, 0, 0)
        }  
             if(creationDate<=date &&(taskCompletionDate===null ||taskCompletionDate>=date)){
              total+=1
             }
        });

    return total

 }

 completedTasksByDate(Tasks,date){
  let total=0;
   date=date.setHours(0, 0, 0, 0)

    const completedTasks = Tasks.filter(task =>{
        let taskCompletionDate= null
        const creationDate=new Date(task.created_at).setHours(0, 0, 0, 0)
        if(task.Completion){
          taskCompletionDate=new Date(task.Completion).setHours(0, 0, 0, 0)
        }  
             if(taskCompletionDate!=null && taskCompletionDate<date){
              total+=1
             }
        });

    return total

 }



 getDates(startDate){
    const dates=[]

    const currentDate= new Date();
    const startEndDate = new Date(startDate); 
    while (startEndDate.setHours(0, 0, 0, 0) <= currentDate.setHours(0, 0, 0, 0)) {
        dates.push(new Date(startEndDate));
        startEndDate.setDate(startEndDate.getDate() + 1);
      }

      return dates
 }


 getStartDate(Tasks){
  let date=''

   Tasks.forEach(task => {

    const minDate = new Date(task.created_at)

    if(date===''){

      date= minDate;

    }else{
      if(minDate.setHours(0, 0, 0, 0)<date.setHours(0, 0, 0, 0)){
        date=minDate
      }
    }


    
   });

return date

 }





 donutGraph(totalTasks,completedTasks,chartHtmlId){
    return new Chart(chartHtmlId, {
        type: 'doughnut',
        data: {
          labels: ['Completion'],
          datasets: [{
            data: [completedTasks,totalTasks-completedTasks],
            backgroundColor: ['#4CAF50','#FFF'],
            borderWidth: 2
          }]
        },
        options: {
          cutout: '60%',
          plugins: {
            legend: {
      position: 'right',
      labels: {
        color: '#580cd1',
        boxWidth: 20,
      }
    },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || '';
                  let value = context.parsed;
                  let total = context.chart._metasets[context.datasetIndex].total;
                  let percentage = ((value / totalTasks) * 100).toFixed(1);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });



      

}


linegraph(mylabels,myData,myCompletedData,chartHtmlId){



        const myLineChart = new Chart(chartHtmlId, {
      type: 'line',
      data: {
        labels: mylabels,
        datasets: [{
          label: 'Incomplete Tasks',
          color: '#580cd1',
          data: myData,
          borderColor: 'red',
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          fill: true,
          tension: 0.3, // smooth curve
        },

        {
          label: 'complete Tasks',
          color: '#580cd1',
          data: myCompletedData,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          fill: true,
          tension: 0.3, // smooth curve
        }
      
      
      ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          },
          title: {
            display: true,
            text: ' Task distribution on a specific day'
          }
        },
scales: {
    x: {
      title: {
        display: true,
        text: 'Month and Day'
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Tasks'
      }
    }
  }
      }
    })


      }


generatePDF(docElement){

html2pdf()
  .set({
    margin: 0,
    filename: 'progress.pdf',
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    image: { type: 'jpeg', quality: 2 },
    html2canvas: { scale: 5 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
  })
.from(docElement)
.save();

}

























}