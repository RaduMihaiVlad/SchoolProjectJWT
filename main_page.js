let index = 1;
let value_sum1 = 0;
let value_sum2 = 0;
let value_sum3 = 0;
let value_total_sum = 0;
let current_user = "";
let added = false;

function create_json(json_dict) {
    return JSON.stringify(json_dict);
}

function sum1() {
    document.getElementsByTagName("a")[0].setAttribute("class", "active");
    document.getElementsByTagName("a")[1].removeAttribute("class");
    document.getElementsByTagName("a")[2].removeAttribute("class");
    document.getElementsByTagName("a")[3].removeAttribute("class");
    
    document.getElementById("update_sum_index").innerHTML = "Update sum 1: ";

    document.getElementById("sum-input").value = value_sum1;
    // document.getElementById('update_value').style.visibility = 'visible';

    if (added == false) {
        var btn = document.createElement("BUTTON");   
        btn.innerHTML = "Update";     
        btn.setAttribute("id", "btn_update");
        btn.addEventListener("click", function() {
            update_sum();
        }, false);               
        document.body.appendChild(btn);               
        added = true;
    }


    index = 1;

}

function sum2() {
    document.getElementsByTagName("a")[1].setAttribute("class", "active");
    document.getElementsByTagName("a")[0].removeAttribute("class");
    document.getElementsByTagName("a")[2].removeAttribute("class");
    document.getElementsByTagName("a")[3].removeAttribute("class");

    document.getElementById("update_sum_index").innerHTML = "Update sum 2: ";

    document.getElementById("sum-input").value = value_sum2;
    // document.getElementById('update_value').style.visibility = 'visible';
    if (added == false) {
        var btn = document.createElement("BUTTON");   
        btn.innerHTML = "Update";     
        btn.setAttribute("id", "btn_update");
        btn.addEventListener("click", function() {
            update_sum();
        }, false);               
        document.body.appendChild(btn);               
        added = true;
    }


    index = 2;

}

function sum3() {
    document.getElementsByTagName("a")[2].setAttribute("class", "active");
    document.getElementsByTagName("a")[1].removeAttribute("class");
    document.getElementsByTagName("a")[0].removeAttribute("class");
    document.getElementsByTagName("a")[3].removeAttribute("class");

    document.getElementById("update_sum_index").innerHTML = "Update sum 3: ";

    document.getElementById("sum-input").value = value_sum3;

    if (added == false) {
        var btn = document.createElement("BUTTON");   
        btn.innerHTML = "Update";     
        btn.setAttribute("id", "btn_update");
        btn.addEventListener("click", function() {
            update_sum();
        }, false);               
        document.body.appendChild(btn);               
        added = true;
    }


    // document.getElementById('update_value').style.visibility = 'visible';

    index = 3;
}

function total_sum() {
    document.getElementsByTagName("a")[3].setAttribute("class", "active");
    document.getElementsByTagName("a")[1].removeAttribute("class");
    document.getElementsByTagName("a")[2].removeAttribute("class");
    document.getElementsByTagName("a")[0].removeAttribute("class");
    
    document.getElementById("update_sum_index").innerHTML = "Total Sum ";

    document.getElementById("sum-input").value = (value_sum1 + value_sum2 + value_sum3);
    // document.getElementById('update_value').style.visibility = 'hidden';

    // taskId = "update_value";
    // var div = document.getElementById("calculator" + taskId);
    // div.parentNode.removeChild(div);

    var elem = document.getElementById('btn_update');
    elem.parentNode.removeChild(elem);
    added = false;

    index = 4;

}

function calculate_sum() {
    let xhr2 = new XMLHttpRequest();
    
    let URL = 'http://localhost:3001/get_sums?username=' + current_user;
    xhr2.open('GET', URL);
    xhr2.setRequestHeader("Content-Type", "application/json");
    xhr2.send();
    xhr2.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status === 200) {
                current_result = JSON.parse(this.response);
                value_sum1 = parseInt(current_result.sum1);
                value_sum2 = parseInt(current_result.sum2);
                value_sum3 = parseInt(current_result.sum3);
                sum1();
            }
        }
    }
}

function start() {

    added = false;
    let xhr = new XMLHttpRequest();
    let URL = 'http://localhost:3001/get_username_put'
    xhr.open('PUT', URL);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status === 200) {
                current_user = JSON.parse(this.response).username;
                calculate_sum();
            }
        }
    }

}

function update_sum() {
    var current_value = document.getElementById("sum-input").value;
    let URL = 'http://localhost:3001/change_value?index=' + index.toString() 
    + '&currentvalue=' + current_value.toString() + "&username=" + current_user;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', URL);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status === 200) {
                if (index == 1) {
                    value_sum1 = parseInt(current_value);
                    sum1();
                } else if (index == 2) {
                    value_sum2 = parseInt(current_value);
                    sum2();
                } else {
                    value_sum3 = parseInt(current_value);
                    sum3();
                }
            } else {
                alert('Session expired');
                location.replace('login.html'); 
            }
        }
    }

}

function sign_out() {
    let xhr = new XMLHttpRequest();
    let URL = 'http://localhost:3001/sign_out?'
    xhr.open('GET', URL);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status === 200) {
                location.replace('login.html'); 
            } else {
                location.replace('login.html'); 
            }
        }
    }
}

function delete_account() {
    let xhr = new XMLHttpRequest();
    let URL = 'http://localhost:3001/delete_account?';
    xhr.open("DELETE", URL);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status === 200) {
                location.replace('login.html'); 
            } else if (this.status == 403) {
                location.replace('login.html'); 
            }
        }
    }
}