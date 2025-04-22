function registrationDetailsPresent(details){

    if(Object.values(details).includes('')){
       return false
    }

return true

}

function existingEmail(email){

if(email===''){
    return true;
    
}

return false;

}

/////


test("checking if we recived an existing email from the server",()=>{
    const result = existingEmail("dolphnoble@gmail.com");
    expect(result).toBe(false);
});

test("email does not exist in database",()=>{
    const result = existingEmail("");
    expect(result).toBe(true);
});



test("if all  details  not present",()=>{
    const result = registrationDetailsPresent({userType:"",email:"",password:""});
    expect(result).toBe(false);
});


test("if all  details  not present",()=>{
    const result = registrationDetailsPresent({userType:"user",email:"",password:"password"});
    expect(result).toBe(false);
});





test("if user details  present",()=>{
    const result = registrationDetailsPresent({userType:"user",email:"email",password:"password"});
    expect(result).toBe(true);
});

function getJob(id){
    if(id==="id1"){
        return {decsription:"description",amount:"100",name:"name"}
    }else{
        return "you have not posted any jobs"
    }
}
function viewUsers(){
    return ["user1","user2"]
}

function jobs(job){
    if(job.status==="free"){
        return "accepted"
    }else{
        return "taken"
    }
}



test("if a user posts a job then they should be able to get details about it",()=>{
    const result = getJob("id1");
    expect(results).toEqual({decsription:"description",amount:"100",name:"name"})
    
})
    test("if a user has not posted a job then they should  not have details for any job",()=>{
    const result = getJob("id2");
    expect(results).toEqual("you have not posted any jobs")
    
})

test("if a job is available a freelancer should be able to accept it",()=>{
    const result = jobs({status:"free",description:"description"});
    expect(results).toEqual("accepted")
    
})

test("if a job is not available a freelancer should not be able to accept it",()=>{
    const result = jobs({status:"free",description:"description"});
    expect(results).toEqual("taken")
    
})

test("if an admin can see all users",()=>{
    const result = viewUsers();
    expect(results).toEqual(["user1","user2"])
    
})












