import supabase from '../config/superbaseClient.js'
//change the below lines to getdocumentbyid if required :)
const aplicationList= document.querySelector('Aplications')
//add show alert later
//add superbase realtime
//styles for messages page to allow auto scroll
//sentBY== false means sent by client

export class Aplications {

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

    async AcceptAplication(){
        try {
            const { data: aplications, error } = await supabase
            .from('Aplications')
            .update({ status: true})
            .match({'freelancerID':this.freelancerID,jobID:this.projectID})

            const { data: rejected, error: rejectError } = await supabase
            .from('Aplications')
            .update({ status: false })
            .neq('freelancerID', this.freelancerID)
            .match({ jobID: this.projectID });

            const { data, error2 } = await supabase
            .from('Jobs')
            .update({ freelancerID: this.freelancerID, assigned:true})
            .match({id:this.projectID})

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


    async RejectAplication(){
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

    async  showCV(filename) {
        console.log('cv/'+filename)

        try {
            const { data, error } = await supabase
            .storage
            .from('user-documents')
            .download('cv/'+filename);
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
                    console.log('the freelancer has not uploaded a cv')
                    this.showAlert('the freelancer has not uploaded a cv','error')
                    return
                }


            }
            
        } catch (error) {
            console.log(error.message)
            this.showAlert(error.message,'error');
            return
            
        }
        
    }


    async newAplication(freelancerName){
        const allapliactions= document.getElementById('myAplicants')
        //console.log(allapliactions)
        

        //adding each fetched message to the page with massages
       // <img src="./images/profile_picture.jpg" alt="Profile Picture" class="profile-pic" />
        const name= document.createElement('p')
        name.textContent= freelancerName

        const list= document.createElement('li');

    

        const sec=document.createElement('section')
        sec.className="aplicant-profile";

        const profilepic= document.createElement('img')
        profilepic.src="./images/profile_picture.jpg";
        profilepic.className="freelancer-pic";

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

        sec.append(profilepic,name,cv,accept,reject,chat)
 
        list.appendChild(sec)
        allapliactions.appendChild(list)

       allapliactions.scrollIntoView({behavior: 'smooth'},300)

        accept.addEventListener('click',async (e)=>{
            try {
                const result= await this.AcceptAplication()
                reject.disabled=true;
                accept.disabled=true;
                setTimeout(() => {
                    window.location.href = './Client.html'; 
                  }, 2000);

                
            } catch (error) {

                this.showAlert(error.message)              
            }
        })

        reject.addEventListener('click',async (e)=>{
            try {
                const result= await this.RejectAplication()
                reject.disabled=true;
                accept.disabled=true;
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