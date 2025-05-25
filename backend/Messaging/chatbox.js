import {Messages} from './Utils.js'
import {supabase} from '../config/superbaseClient.js';


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




let chat;
if(freelancerID){

  //need to change change this also
  console.log('freelacer dolf')

    const { data: userData, error: fetchError1 } = await supabase
        .from("Jobs")
        .select("id")
        .match({freelancerID:freelancerID,clientID:user.id});

        console.log(userData,'...........')

    if (fetchError1) {
        console.error('Error fetching job data:', fetchError1.message);
    }


    console.log("ID of freelancer on client side:",freelancerID)
    console.log("ID of Client on client side:",user.id)
    //sentBy = false;

    chat = new Messages(user.id,freelancerID,userData[0]?.id)



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
        try {
            
            const response = await chat.createMessage(user.id,freelancerID, userData[0]?.id, msg, false);
            messageInput.value = "";
            console.log('The response of logged in as client',response);
            if (response) {
              messageInput.value = ""; 
            } else {
              console.log('Failed to send message');
            }
          } catch (error) {
            console.log('Error sending message:', error);
          }

      }else{
        console.log("Message is empty")
    }
  });

  // Allow Enter key to send the message
messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent default newline behavior
    sendButton.click();     // Trigger the send action
  }
});


    loadMessages();



   
}else{
    
   // change fecthing jobs for a function
    const { data: userData, error: fetchError1 } = await supabase
    .from("Jobs")
    .select("id")
    .match({freelancerID:user.id,clientID:clientID});

    if (fetchError1) {
        console.error('Error fetching job data:', fetchError1.message);
    }

    console.log("ID of client:",clientID)
    //sentBy = true;
    chat = new Messages(clientID,user.id,userData[0]?.id) 

    // Load and display existing messages
    async function loadMessages() {
        try {
        const messages = await chat.getMassages();
        if (messages) {
            chat.addMessagesToPage(messages);
        } else {
            console.log("No prev messages found");
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
        try {
            
            const response = await chat.createMessage(clientID,user.id, userData[0]?.id, msg, true);
            messageInput.value = "";
            console.log('The response of logged in as client',response);
            if (response) {
              messageInput.value = ""; 
            }
          } catch (error) {
            console.log('Error sending message:', error);
          }

      }else{
        console.log("Message is empty")
    }
  });

  // Allow Enter key to send the message
messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent default newline behavior
    sendButton.click();     // Trigger the send action
  }
});


loadMessages();
}
 





   

