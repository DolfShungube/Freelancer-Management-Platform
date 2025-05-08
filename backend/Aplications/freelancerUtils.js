import supabase from '../config/superbaseClient.js'
//change the below lines to getdocumentbyid if required :)
const aplicationList= document.querySelector('Aplications')
//add show alert later
//add superbase realtime
//styles for messages page to allow auto scroll
//sentBY== false means sent by client

//llllllllllllllllllllllllllllllllllll

export class FreelancerAplications {

    constructor(freelancerID,projectID) {
        this.freelancerID=freelancerID;
        this.projectID=projectID;
        
    }

       showAlert(message, type = 'info') {
        Swal.fire({
            title: type === 'success' ? 'Success!' : 'Oops!',
            text: message,
            icon: type,  // 'success', 'error', 'warning', 'info'
            confirmButtonText: 'OK'
        });
    }

    async getFreelancer(){
        try {
            const { data: aplications, error } = await supabase
            .from('Freelancer')
            .select('*')
            .eq('id', this.freelancerID)

            if(error){
                this.showAlert(error.message,'error');
                return
            }


            console.log(aplications)
            return aplications


        } catch (error) {

            this.showAlert(error.message,'error');
            return
            
        }

    }




    async SendAplication(){
        try {
            const { data: aplications, error } = await supabase
            .from('Aplications')
            .update({ status: false})
            .match({'freelancerID':this.freelancerID,jobID:this.projectID})

            if(error){
                this.showAlert(error.message,'error');
                return
            }

            return aplications


        } catch (error) {
            this.showAlert(error.message,'error');
            return
            
        }

    }




    async newAplication(freelancerName){
        const allapliactions= document.getElementById('myAplicants')
        //console.log(allapliactions)
        

        //adding each fetched message to the page with massages
        const name= document.createElement('p')
        name.textContent= freelancerName

        const list= document.createElement('li');
    

        const sec=document.createElement('section')

        const cv = document.createElement('button');
        cv.type = 'button';
        cv.textContent = 'View CV';

        const accept = document.createElement('button');
        accept.type = 'button';
        accept.textContent = 'accept'; 

        const reject = document.createElement('button');
        reject.type = 'button';
        reject.textContent = 'reject';

        const chat = document.createElement('button');
        chat.type = 'button';
        chat.textContent = 'chat';

        sec.append(name,cv,accept,reject,chat)
 
        list.appendChild(sec)
        allapliactions.appendChild(list)

       allapliactions.scrollIntoView({behavior: 'smooth'},300)

        accept.addEventListener('click',async (e)=>{
            try {
                const result= await this.AcceptAplication()
            } catch (error) {

                this.showAlert(error.message)              
            }
        })

        reject.addEventListener('click',async (e)=>{
            try {
                const result= await this.RejectAplication()
            } catch (error) {

                this.showAlert(error.message)              
            }
        })

        cv.addEventListener('click',async (e)=>{
            try {
                const result= await this.showCV(this.freelancerID+'-cv.pdf')
            } catch (error) {

                this.showAlert(error.message)              
            }
        })

    }


}