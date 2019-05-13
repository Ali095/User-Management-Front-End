function addNew(obj) {
    // alert('in add new with '+ JSON.stringify(obj));
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/api/addNewUser",
        data: JSON.stringify(obj),
        dataType: 'json',
        contentType: 'application/json'
    }).done((res) => {
        console.log('succesfully added into the db');
    }).fail(() => {
        console.log('an error occured during calling the api');
    });
}

function getDataFromAPI() {
    // var resArray = [];
    $.ajax({
        type: "GET",
        url: "http://localhost:5000/api/users"
    }).done((res) => {
        console.log(`succesfully retreive from the db \ntype=>${typeof(res)}\ndata=>${(res)}`);
        for (var i = 0; i < res.length; i++) {
            var tr = `<tr id="${res[i]["_id"]}">`;
            var td1 = "<td id='name-col'>" + res[i]["name"] + "</td>";
            var td2 = "<td id='age-col'>" + res[i]["age"] + "</td>";
            var td3 = "<td id='contact-col'>" + res[i]["contact"] + "</td>";
            var td4 = "<td id='cnic-col'>" + res[i]["cnic"] + "</td>";
            var td5 = "<td id='dob-col'>" + res[i]["dob"] + "</td>";
            var td6 = "<td id='address-col'>" + res[i]["address"] + "</td>";
            var td7 = `<td> <a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>
                            <a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
                            <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
                            <a class="submit" title="Submit" data-toggle="tooltip"><i class="material-icons">done</i></a>
                            <a class="cancel" title="cancel" data-toggle="tooltip">
                                    <i class="material-icons">
                                        cancel
                                    </i>
                                </a>
                        </td> </tr>`;
            $("#tBody-for-loop").append(tr + td1 + td2 + td3 + td4 + td5 + td6 + td7);
        }
    }).fail(() => {
        console.log('an error occured during calling the api');
    });

}


function deleteOneUser(id) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:5000/api/deleteUser/?id=${id}`
    }).done((res) => {
        console.log('successfully deleted!!');
    }).fail(() => {
        console.log('something bad happen');
    });
}

function getOneUser(id) {
    // let singalUser;
    $.ajax({
        type: "GET",
        url: `http://localhost:5000/api/user/?id=${id}`,
        success: function (userobj) {
            // console.log('get an user ' + JSON.stringify(response));
            // singalUser=response;
            $("#name-col").html(`<input type="text" placeholder="Enter the Name" class="form-control" name="name" id="name" value="${userobj.name}">`);
            $("#age-col").html(`<input type="text" placeholder="Enter the age" class="form-control" name="age" id="age" value="${userobj.age}">`);
            $("#cnic-col").html(`<input type="text" placeholder="Enter the CNIC" class="form-control" name="cnic" id="cnic" value="${userobj.cnic}">`);
            $("#address-col").html(`<input type="text" placeholder="Enter the Address" class="form-control" name="address" id="address" value="${userobj.address}">`);
            $("#contact-col").html(`<input type="text" placeholder="Enter the Contact" class="form-control" name="phone" id="phone" value="${userobj.contact}">`);
            $("#dob-col").html(`<input type="text" placeholder="Enter the DOB" class="form-control" name="dob" id="dob" value="${userobj.dob}">`);
        }
    }).fail(() => {
        console.log('something Bad happen');
    });
    // console.log('user=> '+ JSON.stringify(singalUser));
    // return singalUser;
}

function updateOneUser(userId, obj) {
    $.ajax({
        type: "PUT",
        url: "http://localhost:5000/api/updateUser",
        data: `{
            "_id": "${userId}",
            "name": "${obj.name}",
            "dob": "${obj.dob}",
            "cnic": "${obj.cnic}",
            "age": "${obj.age}",
            "contact":"${obj.contact}",
            "address":"${obj.address}"
        }`,
        dataType: "json",
        contentType: 'application/json',
        success: function (response) {
            console.log('succesfully updated');
        }
    });
}

function cancelOneUser(id) {
    // let singalUser;
    $.ajax({
        type: "GET",
        url: `http://localhost:5000/api/user/?id=${id}`,
        success: function (userobj) {
            // console.log('get an user ' + JSON.stringify(response));
            // singalUser=response;
            $("#name-col").html(`${userobj.name}`);
            $("#age-col").html(`${userobj.age}`);
            $("#cnic-col").html(`${userobj.cnic}`);
            $("#address-col").html(`${userobj.address}`);
            $("#contact-col").html(`${userobj.contact}`);
            $("#dob-col").html(`${userobj.dob}`);
        }
    }).fail(() => {
        console.log('something Bad happen');
    });
    // console.log('user=> '+ JSON.stringify(singalUser));
    // return singalUser;
}

$(document).ready(function () {
    getDataFromAPI();
    $('[data-toggle="tooltip"]').tooltip();
    var actions = $("table td:last-child").html();
    // Append table with add row form on add new button click
    $(".add-new").click(function () {
        $(this).attr("disabled", "disabled");
        var index = $("table tbody tr:last-child").index();
        var row = '<tr>' +
            '<td id="name-col"><input type="text" placeholder="Enter the Name" class="form-control" name="name" id="name"></td>' +
            '<td id="age-col"><input type="text" placeholder="Enter the age" class="form-control" name="age" id="age"></td>' +
            '<td id="contact-col"><input type="text" placeholder="Enter the Contact" class="form-control" name="phone" id="phone"></td>' +
            '<td id="cnic-col"><input type="text" placeholder="Enter the CNIC" class="form-control" name="cnic" id="cnic"></td>' +
            '<td id="dob-col"><input type="text" placeholder="Enter the DOB" class="form-control" name="dob" id="dob"></td>' +
            '<td id="address-col"><input type="text" placeholder="Enter the Address" class="form-control" name="address" id="address"></td>' +
            '<td>' + actions + '</td>' +
            '</tr>';
        $("table").append(row);
        $("table tbody tr").eq(index + 1).find(".add, .edit").toggle();
        $('[data-toggle="tooltip"]').tooltip();
    });
    // Add row on add button click
    $(document).on("click", ".add", function () {
        var empty = false;
        var input = $(this).parents("tr").find('input[type="text"]');
        input.each(function () {
            if (!$(this).val()) {
                $(this).addClass("error");
                empty = true;
            } else {
                // alert($(this).val());
                $(this).removeClass("error");
            }
        });
        $(this).parents("tr").find(".error").first().focus();
        if (!empty) {
            let userobj = {
                name: $('input[name="name"]').val(),
                age: $('input[name="age"]').val(),
                cnic: $('input[name="cnic"]').val(),
                contact: $('input[name="phone"]').val(),
                dob: $('input[name="dob"]').val(),
                address: $('input[name="address"]').val()
            };
            addNew(userobj);
            alert('successfully added');
            input.each(function () {
                $(this).parent("td").html($(this).val());
            });
            $(this).parents("tr").find(".add, .edit").toggle();
            $(".add-new").removeAttr("disabled");
        }
    });
    // Edit row on edit button click
    $(document).on("click", ".edit", function () {
        let userId = $(this).parents("tr").attr('id');
        getOneUser(userId);
        $(this).parents("tr").find(".edit, .submit, .delete, .cancel").toggle();
        $(".add-new").attr("disabled", "disabled");
    });
    // submit the edit on submit button click
    $(document).on("click", ".submit", function () {
        let userId = $(this).parents("tr").attr('id');
        let userobj = {
            name: $('input[name="name"]').val(),
            age: $('input[name="age"]').val(),
            cnic: $('input[name="cnic"]').val(),
            contact: $('input[name="phone"]').val(),
            dob: $('input[name="dob"]').val(),
            address: $('input[name="address"]').val()
        };
        updateOneUser(userId, userobj);s
        var input = $(this).parents("tr").find('input[type="text"]');
        input.each(function(){
            $(this).parent("td").html($(this).val());
        });	
        $(this).parents("tr").find(".edit, .submit, .delete, .cancel").toggle();
        $(".add-new").removeAttr("disabled");
    });
    // cancel the edit form on button click
    $(document).on("click", ".cancel", function (){
        let userId = $(this).parents("tr").attr('id');
        cancelOneUser(userId);
        // var input = $(this).parents("tr").find('input[type="text"]');
        // input.each(function(){
        //     $(this).parent("td").html($(this).val());
        // });
        $(this).parents("tr").find(".edit, .submit, .delete, .cancel").toggle();
        $(".add-new").removeAttr("disabled");
    });
    // Delete row on delete button click
    $(document).on("click", ".delete", function () {
        let userId = $(this).parents("tr").attr('id');
        deleteOneUser(userId);
        $(this).parents("tr").remove();
        $(".add-new").removeAttr("disabled");
    });
});