function validateLoginCredentials()
{
    var email = document.getElementById("input_email").value;
    var pswd = document.getElementById("input_pswd").value;
    if((!email)&&(!pswd))
    {
        $('.err').text("Enter Email and Password");
    }
    else if(!email)
    {
        $('.err').text("Enter Email");
    }
    else if(!pswd)
    {
        $('.err').text("Enter Password");
    }
    else   // all creds entered
    {
        var postData = {email:email,pswd:pswd};
        $.ajax({
            url: "/login",
            type: "POST",
            data: postData,
            success: function(data)
            {
                console.log("Reply came from POST url");
                if(data=="0")   // valid credentials
                {
                    window.location = "/dashboard";
                }
                else if(data=="1")
                {
                    $('.err').text("Invalid Email Address");
                }
                else if(data=="2")
                {
                    $('.err').text("These Credentials are Not Registered, Please Register Yourself");
                }
            },
            error: function (error)
            {
                alert("ERROR: " + JSON.stringify(error));
            }
        });
    }
}
