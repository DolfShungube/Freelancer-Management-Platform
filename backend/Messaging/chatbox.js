import {Messages} from './Utils.js'
import supabase from '../config/superbaseClient.js';

// DOM elements
const chatbox = document.getElementById('chatbox');
const messageInput = document.getElementById('messageInput');
//the username I will use the cuurently logged in user
const sendButton = document.getElementById('sendButton');
 
let sentBy = false;

const urlParams = new URLSearchParams(window.location.search);
const clientID = urlParams.get('clientID');
const freelancerID = urlParams.get('freelancerID');

// Get current user ID 
const {data:{user},error:authError} = await supabase.auth.getUser();
console.log("currenlty logged in user", user.id)



const { data: userData, error: fetchError1 } = await supabase
  .from("Jobs")
  .select("id")
  .eq("freelancerID", freelancerID);
 


if (fetchError1) {
  console.error('Error fetching job data:', fetchError1.message);
}

// Check and log the result
console.log( userData); 
if (userData) {

  console.log("Job ID:", userData[0]?.id);  
} else {
  console.log("No job data found for freelancer ID:", user.id);
}

let chat;

if(freelancerID){
    console.log("ID of freelancer on client side:",freelancerID)
    console.log("ID of Client on client side:",user.id)
    //sentBy = false;
    chat = new Messages(user.id,freelancerID,userData[0]?.id)
}else if(!freelancerID){
    console.log("ID of client on freelancer:",clientID)
    //sentBy = true;
    chat = new Messages(clientID,user.id,userData[0]?.id) 
}


// Load and display existing messages
async function loadMessages() {
    try {
      const messages = await chat.getMassages();
      if (messages) {
        chat.addMessagesToPage(messages);
      } else {
        console.log("No messages found");
      }
    } catch (error) {
      console.log("Error loading messages:", error);
    }
  }



// 2. Listen for new messages in real-time
chat.addNewMessage();

// Send new message when button is clicked
sendButton.addEventListener('click', async () => {
    const msg = messageInput.value.trim();
  
    if (msg !== '') {

      if(freelancerID){

        try {
            console.log('person sending message:',user.id);
            console.log('sending mesage to:',freelancerID);
            console.log('projectID:',userData[0]?.id);
            console.log('message being send:', msg);
            console.log('if client sent the message (false)',false);
            const response = await chat.createMassage(user.id,freelancerID, userData[0]?.id, msg, false);
            
            console.log('The response of logged in as client',response);
            if (response) {
              messageInput.value = ''; // Clear input field after sending message
            } else {
              console.log('Failed to send message');
            }
          } catch (error) {
            console.log('Error sending message:', error);
          }

      }else{
        try {
            const response = await chat.createMassage(clientID,user.id, userData[0]?.id, msg, true);
            console.log('The response of logged in as freelancer',response);
            if (response) {
              messageInput.value = ''; // Clear input field after sending message
            } else {
              console.log('Failed to send message');
            }
          } catch (error) {
            console.log('Error sending message:', error);
          }
      }
  
     
    }else{
        console.log("Message is empty")
    }
  });

loadMessages();