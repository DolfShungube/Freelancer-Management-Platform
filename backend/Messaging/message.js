import Messages from './Utils.js'

// DOM elements
const chatbox = document.getElementById('chatbox');
const messageInput = document.getElementById('messageInput');
//the username I will use the cuurently logged in user
const usernameInput = document.getElementById('username');
const sendButton = document.getElementById('sendButton');
let freelancerID; 
let clientID; 
let sentBy = false;

// Get current user ID 
const {data:{user},error:authError} = await supabase.auth.getUser();

const { data:userData, error: fetchError1 } = await supabase
    .from("Jobs")
    .select("id,clientID,freelancerID")
    .or(`clientID.eq.${user.id},freelancerID.eq.${user.id}`)
    .single(); 





const chat = new Messages(userData.clientID,userData.freelancerID,userData.id)

//load the existing messages and display
async function loadMessages(){
    const messages = await chat.getMassages();
    if(messages){
        chat.addMessagesToPage(messages)
    }else{
        console.log("Failed to add message to page");
    }

}

// 2. Listen for new messages in real-time
chat.addNewMessage();

//send new message
sendButton.addEventListener('click',async()=>{
    const msg = messageInput.ariaValueMax.trim();
    if(msg!==''){
        const response = await chat.createMassage(clientID, freelancerID, projectID, msg,sentBy);
        if(response){
            messageInput.value = '';
        }
    }
})

loadMessages();