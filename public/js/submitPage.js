var max_file_size = 5 * 1024 * 1024;    // 5 MB
function validateForm()
{
    var fname = document.getElementById("fileToUpload").value;
    if(fname == '')
    {
        document.getElementById("err_msg_div").innerHTML = "Please Select Some File You Motherfucker";
        return false;
    }
    else
    {
        var fileSize = document.getElementById("fileToUpload").files[0].size;
        if(fileSize > max_file_size)
        {
            document.getElementById("err_msg_div").innerHTML = "File is too Big to Upload";
            return false;
        }
        else
        {
            document.getElementById("fileSubmitForm").style.display = "none";
            document.getElementById("err_msg_div").style.display = "none";
            document.getElementById("render_loading_page").style.display = "block";
            return true;
        }
    }
}
