import superbase from '../config/superbaseClient.js'
//change the below lines to getdocumentbyid if required :)
const messageList= document.querySelector('message')
const writeNewMessage=document.querySelector('newmessage')
//add show alert later
//add superbase realtime
//styles for messages page to allow auto scroll
//sentBY== false means sent by client

class Messages {

    constructor(clientID,freelancerID,projectID) {
        this.clientID=clientID;
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

    async getMassages() {
        //getting all the massages between freelancer and client for a specific job

        try {
             const {data:messages,error}= await superbase
            .from('Messages')
            .select('*')
            .match({ clientID: this.clientID, freelancerID: this.freelancerID,projectID:this.projectID });  

            if(error){
                this.showAlert(error.message,'error');
                return
            }

            return messages


        } catch (error) {

            this.showAlert(error.message,'error');
            return
            
        }

     
    }

    async newMassege(message){

        //adding each fetched message to the page with massages

        const list= document.createElement('li');

        list.innerHTML=`
        <p>${message.message}</p>
        <p>${message.created_at}</p>
               `
        messageList.append(list)
        messageList.scrollIntoView({behavior: 'smooth'},300)

    }

    addMessagesToPage(messages){
        //dynamicly add message got using newMessage() to page
        messages.forEach(element => {
            this.newMassege(element);               
        });

    }

    async createMassage(clientID,freelancerID,projectID,message,sentBY){
        // adding a new message to the database
        //sentBy takes true or false, if false messege was sent by a client
        

        try {
            const{data,error}= await superbase
                .from('Messages')
                .insert([
                        {message:message,clientID:clientID,projectID:projectID,sentBY:sentBY }
                        ])
            
            if(error){
                this.showAlert(error.message,'error');
                return
            }
            return data
                
            
        } catch (error) {
            this.showAlert(error.message,'error');
            return;
            
            
        }


    }

    async addNewMessage(){
        //listens for when a new message is added to db and fetches it without having to refresh page
        //run after calling createmessage
  
        try {
            const {data:messages,error}= await superbase

            .channel('new message')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Messages' }, (payload) => {
              this.addMessagesToPage(payload.new);
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


}