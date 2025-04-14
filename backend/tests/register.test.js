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