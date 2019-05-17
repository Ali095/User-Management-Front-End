function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
        // sendData(response);
        fbAPICall(response.authResponse.accessToken);
    } else {
        document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
    }
}

function checkLoginState() {
    FB.getLoginStatus(response => {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '{Your-App-ID}',
        cookie: true, // enable cookies to allow the server to access 
        // the session
        xfbml: true, // parse social plugins on this page
        version: 'v3.3' // The Graph API version to use for the call
    });
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });

};

function initFBSDK(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}


function sendFBDatatoServer(accessToken, userobj, userID) {
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/api/fb-login",
        data: `{
                "userObj": ${JSON.stringify(userobj)},
                "accessToken": "${accessToken}",
                "userID":"${userID}"
            }`,
        dataType: 'json',
        contentType: 'application/json'
    }).done((res) => {
        console.log('succesfully added into the db');

    }).fail(() => {
        console.log('an error occured during calling the api');
    });
}
let pageAccessToken, pageID;

function fbAPICall(accessToken) {
    console.log('Welcome!  Fetching your information.... with ac=> ' + accessToken);
    FB.api('/me', {
        fields: 'age_range,birthday,id,name,email,location'
    }, response => {
        // console.log('Successful login for: ' + JSON.stringify(response));
        let userobj = {
            name: response.name,
            age: response.age_range.min,
            cnic: "xxxxx-xxxxxxx-x",
            contact: "xxxx-xxxxxxx",
            dob: response.birthday,
            address: response.location.name
        };
        sendFBDatatoServer(accessToken, userobj, response.id);

        document.getElementById('status').innerHTML =
            'Thanks for logging in, ' + response.name + '!';
    });

    FB.api('/me/accounts', response => {
        pageAccessToken = response.data[0].access_token;
        pageID = response.data[0].id;
        console.log(`in account getting access token=> ${pageAccessToken}\n
        and id = > ${pageID}`);
    });


    FB.api(`/322097165110983/feed`, res => {
        console.log(`succesfully retreive from the db \ntype=>${typeof(res)}\ndata=>${JSON.stringify(res.data[0])}`);
        for (var i = 0; i < res.data.length; i++) {
            var tr = `<tr id="${res.data[i]["id"]}">`;
            var td1 = "<td id='name-col'>" + res.data[i]["message"] + "</td>";
            var td2=`<td><a class="delete" title="Delete" ><i class="material-icons">&#xE872;</i></a></td></tr>`
            $("#tBody-for-loop").append(tr + td1+ td2);
        }
    });

}

function postOnFBPage() {
    let message = $("#message").val();
    $.ajax({
        type: "post",
        url: `https://graph.facebook.com/${pageID}/feed?message=${message}&access_token=${pageAccessToken}`,
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
            console.log(JSON.stringify(response));
        }
    });
}

function deleteOneUser(id) {
    $.ajax({
        type: "DELETE",
        url: `https://graph.facebook.com/${id}?access_token=${pageAccessToken}`
    }).done((res) => {
        console.log('successfully deleted!!');
    }).fail(() => {
        console.log('something bad happen');
    });
}

$(document).on("click", ".delete", function () {
    let userId = $(this).parents("tr").attr('id');
    deleteOneUser(userId);
    $(this).parents("tr").remove();
});