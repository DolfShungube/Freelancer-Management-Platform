import supabase from "../config/superbaseClient.js";
import supabase1 from "../config/test.js";



function showAlert(message, type = 'info') {
    Swal.fire({
        title: type === 'success' ? 'Success!' : 'Oops!',
        text: message,
        icon: type,  // 'success', 'error', 'warning', 'info'
        confirmButtonText: 'OK'
    });
}

window.toggleForm = function () {
  const form = document.getElementById("adminForm");
  const current = window.getComputedStyle(form).display;
  form.style.display = current === "none" ? "block" : "none";
};

document.getElementById("adminForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const firstname = document.getElementById("adminFName").value.trim();
  const lastname = document.getElementById("adminLName").value.trim();
  const email = document.getElementById("adminEmail").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim().toLowerCase();
  const role = document.getElementById("adminRole").value;
  const button = document.getElementById("addAdmin");

      //creating a new user

      button.disable = true;
      button.innerText = "Adding..."
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            firstname: firstname,
            lastname: lastname,      
            table: "Admin"       
          }
        }
      });

    

    if(signUpError){
        showAlert(signUpError,'error');
        console.log(signUpError);
        return error;
    }
    
    Swal.fire({
            title:'Success!',
            text: 'Admin added',
            icon: 'success',
            confirmButtonText: 'OK'
        })
    
    button.disable = false;
    button.innerText = "Submit"
    document.getElementById("adminForm").reset();
    document.getElementById("adminForm").style.display = "none";

    console.log("Admin added")
    
});

//  Display users
function displayClients(users) {
    const userSection = document.querySelector("#users");
  
    // Clear the "No users yet." message if present
    const noTasks = userSection.querySelector(".no-tasks");
    if (noTasks) noTasks.remove();
  
    // Iterate over each user and create a list item
    users.forEach(user => {
      const userElem = document.createElement("p");
      userElem.style.marginTop = "10px";
      userElem.style.fontWeight = "500";
      userElem.textContent = `${user.firstname} ${user.lastname} - Client `;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.style.marginLeft = "10px";
      deleteBtn.style.background = "none";
      deleteBtn.style.border = "none";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.style.fontSize = "1rem";
      deleteBtn.title = "Delete user";

      deleteBtn.onclick = async function () {
        deleteBtn.onclick = async function () {
            Swal.fire({
              title: 'Are you sure?',
              text: "This action cannot be undone!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Yes, delete it!'
            }).then(async (result) => {
              if (result.isConfirmed) {
                const { data, error } = await supabase.from('Client').delete().eq('id', user.id);
                if (error) {
                  Swal.fire('Failed', 'Could not delete from Admin table', 'error');
                  return;
                }
          
                const { error: authError } = await supabase1.auth.admin.deleteUser(user.id);
                if (authError) {
                  Swal.fire('Failed', 'Could not delete from Auth table', 'error');
                  return;
                }
          
                // Optionally: remove from DOM or refresh UI
                Swal.fire('Deleted!', 'User has been deleted.', 'success');

                // Remove the admin from the list in the DOM
                userSection.removeChild(userElem);
                if (userSection.querySelectorAll("p").length === 0) {
                const emptyNote = document.createElement("p");
                emptyNote.className = "no-tasks";
                emptyNote.textContent = "No users yet.";
                //adminSection.insertBefore(emptyNote, document.getElementById("adminForm"));
       }
              }
            });
          };
          
      };
       
      userElem.appendChild(deleteBtn);
      userSection.appendChild(userElem);
    });
  }

  //  Display users
function displayFreelancer(freelancers) {
    const userSection = document.querySelector("#users");
  
    // Clear the "No users yet." message if present
    const noTasks = userSection.querySelector(".no-tasks");
    if (noTasks) noTasks.remove();
  
    // Iterate over each user and create a list item
    freelancers.forEach(freelancer => {
      const userElem = document.createElement("p");
      userElem.style.marginTop = "10px";
      userElem.style.fontWeight = "500";
      userElem.textContent = `${freelancer.firstname} ${freelancer.lastname} - Freelancer `;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.style.marginLeft = "10px";
      deleteBtn.style.background = "none";
      deleteBtn.style.border = "none";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.style.fontSize = "1rem";
      deleteBtn.title = "Delete user";

      deleteBtn.onclick = async function () {
        Swal.fire({
          title: 'Are you sure?',
          text: "This action cannot be undone!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete user!'
        }).then(async (result) => {
          if (result.isConfirmed) {
            const { data, error } = await supabase.from('Freelancer').delete().eq('id', freelancer.id);
            if (error) {
              Swal.fire('Failed', 'Could not delete from Admin table', 'error');
              return;
            }

            // Delete from Supabase Auth
            const { error: authError } = await supabase1.auth.admin.deleteUser(freelancer.id);
            if(authError){
              console.log("Failed to delete from auth table", authError);
            }

            // Optionally: remove from DOM or refresh UI
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
            // Remove the admin from the list in the DOM
            userSection.removeChild(userElem);
  
            // If there are no admins left, show the "No admins yet." message
            if (userSection.querySelectorAll("p").length === 0) {
            const emptyNote = document.createElement("p");
            emptyNote.className = "no-tasks";
            emptyNote.textContent = "No users yet.";
            //adminSection.insertBefore(emptyNote, document.getElementById("adminForm"));
      }
          }
        });
      };
      

      
      userElem.appendChild(deleteBtn);
      userSection.appendChild(userElem);
    });
  }


// Display Admins
function displayAdmins(admins) {
    const adminSection = document.querySelector("#admins");
  
    // Remove "No admins yet." message if it admin exists
    const noTasks = adminSection.querySelector(".no-tasks");
    if (noTasks) noTasks.remove();
  
    const addAdminBtn = adminSection.querySelector("buttonAdd");
    const adminForm = document.getElementById("adminForm");

    // Display each admin
    admins.forEach(admin => {
      const adminElem = document.createElement("p");
      adminElem.style.marginTop = "10px";
      adminElem.style.fontWeight = "500";
      adminElem.textContent = `${admin.firstname} ${admin.lastname}`;

      
      adminSection.insertBefore(adminElem, adminForm);
    });
  }
  

// Load users and admins on page load
window.addEventListener("DOMContentLoaded", async () => {

    // Fetch users from Supabase database
    const { data: users, error } = await supabase.from("Client").select("*");

    const {data:admins,error1} = await supabase.from("Admin").select("*");

    const {data:freelancers,error2} = await supabase.from("Freelancer").select("*");

    if (error || error1 || error2) {
      alert("Failed to fetch users.");
      console.error(error);
      return;
    }
    // Display admins
    displayClients(users);
    displayAdmins(admins);
    displayFreelancer(freelancers);

    const {data:{user},error:authError} = await supabase.auth.getUser();

    const { data: adminData, error: fetchError } = await supabase
    .from("Admin")
    .select("*")
    .eq("id", user.id)
    .single(); 

    if (fetchError || !adminData) {
        console.error("Admin data fetch failed:", fetchError);
        return;
      }

    // Update the greeting
    const greetingElem = document.querySelector(".greeting");
    greetingElem.innerHTML = `
      <img class="profile-icon" src="images/profile_picture.png" alt="Profile icon" style="width: 100px; height: 100px;" />
      Hi ${adminData.firstname} (Admin)
    `;


  });
