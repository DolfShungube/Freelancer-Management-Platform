


const userType= localStorage.getItem('userType')
import supabase from '../config/superbaseClient.js'

export class Progress{


    constructor(clientID,freelancerID,jobID,myTasks){

        this.clientID=clientID
        this.freelancerID=freelancerID
        this.jobID=jobID
        this.myTasks=this.myTasks

    }

    showAlert(message, type = 'info') {
        Swal.fire({
            title: type === 'success' ? 'Success!' : 'Oops!',
            text: message,
            icon: type,  // 'success', 'error', 'warning', 'info'
            confirmButtonText: 'OK'
        });
    }

    async getJob(){
        try {
            const{data,error}= await supabase
            .from('Jobs')
            .select('*')
            .eq('id',this.jobID)

            if (error){
                this.showAlert(error.message,'error')
            }else{
                
                return data[0]
                
            }
            
        } catch (error) {
            this.showAlert(error.message,'error')
            
        }
    }


    async getTask(job){
        console.log(this.jobID)


        try {
            const{data,error}= await supabase
                .from('Tasks')
                .select('feature,status,id')
                .eq('jobID',this.jobID)

                if(error){
                    
                    this.showAlert(error.message,'error')
                    console.log(console.log(error))
                }else{
                    console.log(data,'data')
                    return data
                }

            
        } catch (error) {
            this.showAlert(error.message,'error')
            
        }

    }

    normalizeTasks(task){
        let list=[]

        task.forEach(item=>{

            list.push([item.feature,item.status,item.id])

        })

        return list

    }


     async addTask(task){
       
    

        try {
            const{data,error}= await supabase
                .from('Tasks')
                .insert({jobID:this.jobID,feature:task,status:false})
                

                if(error){
                    
                    this.showAlert(error.message,'error')
                    console.log(console.log(error))
                }else{
                    this.showAlert("new task added",'success')
                }
            
        } catch (error) {
            this.showAlert(error.message,'error')
            
        }

    }

    getTotalTask(tasks){
        
          return tasks.length        

    }

    getCompletedTasks(tasks){
        const total=[];

        tasks.forEach(task => {
            if(task[1]==true){
                total.push(task)
            }
            
        });

        return total
    }

    getInCompletedTasks(tasks){
        const total=[];

        tasks.forEach(task => {
            if(task[1]==false){
                total.push(task)
            }
            
        });

        return total
    }

    completedTasksGraph(totalTasks,completedTasks,chartHtmlId){
        return new Chart(chartHtmlId, {
            type: 'doughnut',
            data: {
              labels: ['Progress'],
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

    taskStatusUpdate(userType,statusPart,TextPart,theDropDown,id){

        if(userType!='Client'){
        statusPart.addEventListener('click',(e)=>{
            console.log('clicked')        
            const state= this.dropDownstatus(statusPart,TextPart,id,theDropDown)
           

        })
    }
}


    taskStructure(parentID,text,status,id){

        const list= document.createElement('li')
        list.className="rowStucture"
        

        const textSection= document.createElement('section')
        const theText=document.createElement('p')
        theText.innerText=text

        const  statusSection= document.createElement('section')
        const theStatus=document.createElement('p')
        const theDropDown=document.createElement('p')
        theDropDown.style.display='none'

        theStatus.className='rowStucture'
        if(status==true){
            theStatus.innerText="COMPLETE"
            
        }else{
            
            theStatus.innerText="PENDING"
        }



        this.taskStatusUpdate(userType,theStatus,theText,theDropDown,id)


        textSection.appendChild(theText)
        statusSection.appendChild(theStatus)
        list.append(textSection,statusSection,theDropDown)
        parentID.appendChild(list)       

    }




async newStatus(status,id){
    console.log(id)

    try {
        const{data,error}= await supabase
            .from('Tasks')
            .update({status:status})
            .eq('id',parseInt(id))

            if(error){
                
                this.showAlert(error+'dolf','error')
                console.log(console.log(error))
            }else{
                //this.showAlert("new task added",'success')
            }
        
    } catch (error) {
       // this.showAlert(error.message,'error')
        
    }

}

    dropDownstatus(element,TextPart,id,theDropDown) {


        document.addEventListener('click', (e) => {
            const ClickDropdown = element.contains(e.target); 
            const clickedItem1= item1.contains(e.target)  
            const clickedItem2=item2.contains(e.target)   
            if (!ClickDropdown && !clickedItem1 && !clickedItem2) {
                console.log('doc clock')
                theDropDown.style.display='none'
                theDropDown.innerText=''
                element.style.display='block'

                return ''

            }

          })

    


        element.style.display='none' 
        theDropDown.style.display='block'

  
        const details=document.createElement('section')
        details.className='dropdown'
    
    
        const list=document.createElement("ul")
    
        const item1=document.createElement("li")
                item1.id="completedTask"
                item1.textContent="COMPLETE"
        const item2=document.createElement("li")
                item2.id="progresstask"
                item2.textContent="PENDING"
    

        list.append(item1,item2)
        details.appendChild(list)
        theDropDown.appendChild(details);

    
    
        item1.addEventListener('click',async(e)=>{

            this.showAlert("Task has been updated as completew","success")
            element.style.display='block'
            element.innerText='COMPLETE'
            theDropDown.innerText=''
            theDropDown.style.display='none'
           this.newStatus(true,id)

            
            
        })
    
        item2.addEventListener('click',async(e)=>{

                this.showAlert('Task is now in progress', 'success');
                element.style.display='block'
                element.innerText='PENDING'
                theDropDown.innerText=''
                theDropDown.style.display='none'           
                 this.newStatus(false,id)

              
            })


    }

        

    


    async serverListener(taskDonutChart){
        try {
            const {data:messages,error}= await supabase
            

            .channel('new Task')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Tasks' }, (payload) => {
    
              const updatedTasks=payload.new;

                const totalCompletedTasks=taskDonutChart.data.datasets[0].data[0]
                const notCompletedTasks=taskDonutChart.data.datasets[0].data[1]+1

                document.getElementById('total-tasks').innerText=notCompletedTasks+ totalCompletedTasks
               taskDonutChart.data.datasets[0].data = [totalCompletedTasks, notCompletedTasks];
               taskDonutChart.update()
               console.log(taskDonutChart.data.datasets[0].data)
            
                const addTask= document.getElementById('myTask');
                this.taskStructure(addTask,updatedTasks.feature,updatedTasks.status,updatedTasks.id)
    


            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'Tasks' }, (payload) => {
    
                const updatedTasks=payload.new;

                  const totalCompletedTasks=taskDonutChart.data.datasets[0].data[0]
                  const notCompletedTasks=taskDonutChart.data.datasets[0].data[1]

                if (updatedTasks.status==true){

                    totalCompletedTasks+=1
                    notCompletedTasks=notCompletedTasks-1

                }else{
                    totalCompletedTasks-=1
                    notCompletedTasks=notCompletedTasks+=1
                    
                }
    
                  document.getElementById('total-tasks').innerText=notCompletedTasks+notCompletedTasks
                  document.getElementById('completed-tasks').innerText=totalCompletedTasks
                 taskDonutChart.data.datasets[0].data = [totalCompletedTasks, notCompletedTasks];
                 taskDonutChart.update()
                 console.log(taskDonutChart.data.datasets[0].data)
              
      
  
  
              })
            .subscribe();

            if(error){
                this.showAlert(error.message,'error');
                return;
            }   
            
        } catch (error) {
            this.showAlert(error.message,'error');
            return;
            
        }
    }

    async  showContract(filename) {
        console.log('contracts/'+filename)

        try {
            const { data, error } = await supabase
            .storage
            .from('user-documents')
            .download('contracts/'+filename);
            console.log(data)

            if(error){
                this.showAlert(error.message,'error'); 
                return              
            }else{
                if(data){ 
                    console.log(data)                 
                    const url = URL.createObjectURL(data);
                    console.log(url)
                    window.open(url);
                    return
                }else{ 
                    console.log('contract has not been uploaded')
                    this.showAlert('contract not available','error')
                    return
                }


            }
            
        } catch (error) {
            console.log(error.message)
            this.showAlert(error.message,'error');
            return
            
        }
        
    }



    dropDownstatusContract(element,theDropDown,userType) {


        document.addEventListener('click', (e) => {
            const ClickDropdown = element.contains(e.target); 
            const clickedItem1= item1.contains(e.target)  
            const clickedItem2=item2.contains(e.target)   
            if (!ClickDropdown && !clickedItem1 && !clickedItem2) {
                console.log('doc clock')
                theDropDown.style.display='none'
                theDropDown.innerText=''
                element.style.display='block'

                return ''

            }

          })

    


        element.style.display='none' 
        theDropDown.style.display='block'

  
        const details=document.createElement('section')
        details.className='dropdown'
    
    
        const list=document.createElement("ul")
    
        const item1=document.createElement("li")
                item1.id="view"
                item1.textContent="View contract"
        const item2=document.createElement("li")
                item2.id="upload"
                item2.textContent="Upload contract"
    

        list.append(item1,item2)
        details.appendChild(list)
        theDropDown.appendChild(details);

    
    
        item1.addEventListener('click',async(e)=>{

             this.showContract(this.clientID+'-'+this.jobID+'-contract.pdf')
            element.style.display='block'
            theDropDown.style.display='none'


            
            
        })

        if(userType==='Client'){
    
        item2.addEventListener('click',async(e)=>{

                window.location.href = './UploadContract.html';
                element.style.display='block'
                theDropDown.style.display='none'  
                         


              
            })
        }


    }

  

}