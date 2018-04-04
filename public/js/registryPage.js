function sendRegistryCredentials()
{
    var fname = document.getElementById("ifn").value;
    var lname = document.getElementById("iln").value;
    var email = document.getElementById("ie").value;
    var pswd = document.getElementById("ip").value;
    if((!fname)||(!lname)||(!email)||(!pswd))
    {
        $('.err').text("Please Fill in all the Credentials");
    }
    else
    {
        var postData = {fname:fname,lname:lname,email:email,pswd:pswd};
        $.ajax({
            url: "/register",
            type: "POST",
            data: postData,
            success: function(data)
            {
                console.log("Reply came from POST url");
                if(data=="0")   // Registered Successfully
                {
                    window.location = "/dashboard";
                }
                else if(data=="1")
                {
                    $('.err').text("Invalid Email Address");
                }
                else if(data=="2")
                {
                    $('.err').text("These Credentials Were Not Registered, Please Try Again after some time");
                }
            },
            error: function (error)
            {
                alert("ERROR: " + JSON.stringify(error));
            }
        });
    }
}
