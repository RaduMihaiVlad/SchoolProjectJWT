function create_json(json_dict) {
    return JSON.stringify(json_dict);
}

let current_username = "";


function login() {

    var user_req = document.getElementById('regusr').value;
    var pass_req = document.getElementById('regpsw').value;

    json_doc = create_json({
        "username": user_req,
        "password": pass_req
    });

    let xhr2 = new XMLHttpRequest();
    xhr2.open('POST', 'http://localhost:3001/login_user');
    xhr2.setRequestHeader("Content-Type", "application/json");
    xhr2.send(json_doc);
    xhr2.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 404) {
                alert("Incorrect user or password");
            } else {
                location.replace('main_page.html'); 
            }
        }
    }
}