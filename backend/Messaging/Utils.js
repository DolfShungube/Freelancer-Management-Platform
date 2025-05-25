import {supabase} from '../config/superbaseClient.js'
//import Swal from 'sweetalert2';
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

    //Done - we moved business logic to supabase backend
    async markMessagesAsRead(user,messages) {
        try {
            const unreadMessageIDs = [];

        // Loop through each message in the array
        messages.forEach(msg => {
            if (!msg.is_Read) { //  Only process unread messages
                
                //if logged in user and  such message belongs to freelancer push to unmarked to be marked
                if (user.id === msg.clientID && msg.sentBy === true) {
                    unreadMessageIDs.push(msg.id);
                }

                //if logged in user is freelancer and  such message belongs to client push to unmarked to be marked
                if (user.id === msg.freelancerID && msg.sentBy === false) {
                    unreadMessageIDs.push(msg.id);
                }
            }
        });

        if (unreadMessageIDs.length === 0) {
            console.log("No unread messages to update.");
            return; // No unread messages, exit
        }

        console.log("Updating messages with IDs:", unreadMessageIDs);

        // Update only unread messages where the current user is the recipient
        const { error } = await supabase.rpc('mark_messages_as_read', {
            user_id: user.id,
            message_ids: unreadMessageIDs
        });

        if (error) {
            console.log("Error updating message status:", error.message);
        } else {
            console.log(`Marked ${unreadMessageIDs.length} messages as read.`);
        }
    } catch (error) {
        console.error("Error marking messages as read:", error.message);
    }
}



    //Done - but optimize this is kida slow I want the message to be shown intantly
    async getMassages() {
        //getting all the massages between freelancer and client for a specific job

        try {
             
            const { data:messages, error } = await supabase
            .rpc('get_project_messages', {client_id: this.clientID,freelancer_id: this.freelancerID,project_id: this.projectID});
            console.log("The messages",messages);

            if(error){
                this.showAlert("could not find your messeges",'error');
                return
            }

            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData?.user) {
            console.error("Error fetching user:", userError);
            }
            const user = userData.user;
            this.markMessagesAsRead(user,messages);
            return messages

        } catch (error) {

            this.showAlert(error.message,'error');
            return
            
        }
    }

    //This one is fine
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

     //Done - we moved business logic to supabase backend
    async createMessage(clientID, freelancerID, projectID, message, sentBY) {

        // adding a new message to the database
        //sentBy takes true or false, if false messege was sent by a client
        console.log(clientID,freelancerID,projectID,message,sentBY)
        try {
            // Supabase function (create_message_rpc) API call
            const { data, error } = await supabase.rpc('create_message_rpc', {
            client_id: clientID,
            freelancer_id: freelancerID,
            project_id: projectID,
            message_text: message,
            sent_by: sentBY
            });

            if (error) {
            this.showAlert(error.message, 'error');
            console.log("Failed to insert message", error);
            return;
            }

            return data; 
        } catch (error) {
            this.showAlert(error.message, 'error');
            console.log(error);
            return;
        }
    }



    //handling the real-time events and the necessary updates on the frontend.
    async addNewMessage(){
        //listens for when a new message is added to db and fetches it without having to refresh page
        //run after calling createmessage
  
        
        try {
            const {data:messages,error}= await supabase

            .channel('new message')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Messages' }, async (payload) => {

                 this.addMessagesToPage([payload.new]);

              // Get logged-in user
                const { data: userData, error: userError } = await supabase.auth.getUser();
                if (userError || !userData?.user) {
                    console.error("Error fetching user:", userError);
                    return;
                }
                const user = userData.user;
             this.markMessagesAsRead([payload.new],user)
             
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
