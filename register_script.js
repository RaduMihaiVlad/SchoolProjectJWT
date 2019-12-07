function create_json(json_dict) {
    return JSON.stringify(json_dict);
}

function add_new_user(username, json_doc) {
    let xhr = new XMLHttpRequest();
    let URL = 'http://localhost:3001/get_user?username=' + username;
    xhr.open('GET', URL);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status === 404) {
                let xhr2 = new XMLHttpRequest();
                xhr2.open('POST', 'http://localhost:3001/add_new_user');
                xhr2.setRequestHeader("Content-Type", "application/json");
                xhr2.send(json_doc);
                xhr2.onreadystatechange = function() {
                    if (this.readyState == 4) {
                        location.replace('login.html');
                        alert("Successfully registered");
                    }
                }
            } else {
                document.getElementById("regusr").value = "";
                document.getElementById("regpsw").value = "";
                document.getElementById("regusr").placeholder = 'User already exists';
                document.querySelector('input[type=text]').style.setProperty("--c", "red");
                document.querySelector('input[type=password]').style.setProperty("--c", "red");
            }
        }
    }
}

function add_user(json_doc) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3001/add_new_user');
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json_doc);
}

function register() {

    var user_req = document.getElementById('regusr').value;
    var pass_req = document.getElementById('regpsw').value;

    json_doc = create_json({
        "username": user_req,
        "password": pass_req
    });
    add_new_user(user_req, json_doc);
}
  