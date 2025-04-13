import { getDetails, issueTracker,getDetailValues,handleUserInput,showAlert} from './utils.js';


//SuperPass#001
const form= document.getElementById('form');
 form.addEventListener('submit',(e)=>{
  
    const details= getDetails();
    const detailValues=getDetailValues()
    e.preventDefault()
   
    let issues=issueTracker(details,detailValues)

    if(issues.length>0){
         e.preventDefault()

     }else{



      async function login() {
       const value=  await handleUserInput(detailValues)
         
      if(value===''){
   
        window.location.href ="./frontend/src/pages/" +detailValues.userType+'.html';

      }else{
         showAlert(value,'error')
      }
   }

   login()


     }


})











