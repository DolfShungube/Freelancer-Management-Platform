import {supabase} from "../config/superbaseClient.js";

//  Move function outside `DOMContentLoaded`
async function checkUnreadMessages(userID) {
    try {
        const { data, error } = await supabase.rpc('get_unread_messages_for_freelancer', {
        user_id: userID // the current freelancer's ID
         });

        if (error) {
            console.log("All messages have been read");
            return [];
        }

        //console.log("Data", data);
        return data.length > 0 ? data : []; 
    } catch (e) {
        console.log("Error checking unread messages", e);
        return [];
    }
}

export default checkUnreadMessages;

// Keep event listener separate
document.addEventListener("DOMContentLoaded", async () => {
    const chatButton = document.querySelector(".chat-btn");

    // Get logged-in user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
        console.error("Error fetching user:", userError);
        return;
    }
    const user = userData.user;

    //  Calling function with correct user ID
    const unreadMessages = await checkUnreadMessages(user.id);

    //  Show red dot if there are unread messages
    if (unreadMessages.length > 0) {
        console.log("There is an unread message for this freelancer");
        chatButton.classList.add("has-unread");
        
    } else {
        chatButton.classList.remove("has-unread");
        console.log("There is no unread message for this freelancer");
    }

    // Refresh every 5 seconds
    setInterval(async () => {
        const unreadMessages = await checkUnreadMessages(user.id);
        if (unreadMessages.length > 0) {
            chatButton.classList.add("has-unread");
        } else {
            chatButton.classList.remove("has-unread");
        }
    }, 5000);
});
