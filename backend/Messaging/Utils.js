import supabase from '../config/superbaseClient.js'
//change the below lines to getdocumentbyid if required :)

//const writeNewMessage = document.getElementById('messageInput');

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
             const {data:messages,error}= await supabase
            .from('Messages')
            .select('*')
            .match({ clientID: this.clientID, freelancerID: this.freelancerID,projectID:this.projectID })
            .order('created_at', { ascending: true }); 

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
        const messageList = document.getElementById('chatbox');
        const {data:{user},error:authError} = await supabase.auth.getUser();

        //adding each fetched message to the page with massages
        //FALSE = sentBy Client
        //TRUE = sentBy Freelancer

        const article = document.createElement('article');
        if(user.id === message.clientID){
            console.log(message.sentBy)
            if(message.sentBy === false){
                article.classList.add('sent');
            }else{
                article.classList.add('received');  
            }
        
        }

        if(user.id === message.freelancerID){
            if(message.sentBy === true){
                article.classList.add('sent');
            }else{
                article.classList.add('received');  
            }
        
        }
        article.innerHTML = `
        ${message.message}
        <time>${new Date(message.created_at).toLocaleTimeString()}</time>
        `;
        messageList.appendChild(article);
        messageList.scrollTop = messageList.scrollHeight; // Auto scroll to bottom

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
            const{data,error}= await supabase
                .from('Messages')
                .insert([
                        {   message:message,
                            clientID:clientID,
                            freelancerID:freelancerID,
                            projectID:projectID,
                            sentBy:sentBY
                        }
                        ])
            
            if(error){
                this.showAlert(error.message,'error');
                console.log("Failed to insert data",error)
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
            const {data:messages,error}= await supabase

            .channel('new message')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Messages' }, (payload) => {
              this.addMessagesToPage([payload.new]);
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

export { Messages };
