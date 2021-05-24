const submitButton = document.getElementById('submitButton');
const message = document.getElementById('message');
const showInfo = document.getElementById('showInfo');
const addRecordBtn = document.getElementById('addRecordBtn');
const table = document.getElementById("recordsTable");
const tableRef = table.getElementsByTagName('tbody')[0];
const submitConnButton = document.getElementById('submitConnButton');
const connectionStatus = document.getElementById('connection-status');
const debug = document.getElementById('debug');
const add_edit = document.getElementById('add-edit');
const Name = document.getElementById('name');
const email = document.getElementById('email');
const phoneno = document.getElementById('phoneno');
const address = document.getElementById('address');

const selectDb = document.getElementById('select-db');
const dbName = document.getElementById('dbName');
const username = document.getElementById('username');
const password = document.getElementById('password');
const hostname = document.getElementById('hostname');
const port = document.getElementById('port');

var data;
var type;

addRecordBtn.onclick = () => {
    add_edit.innerHTML = "Add Employee Details";
    Name.value = "";
    email.value = "";
    phoneno.value = "";
    address.value = "";
    type = "add";
}

submitButton.onclick = () => {
    if (type == "add") {
        addRecords();
    } else {
        ID = type.split('/')[1];
        editRecords(ID);
    }

};

submitConnButton.onclick = () => {
    addConnection();
};

const addRecords = async () => {

    showInfo.click();

    let payload = {
        name: Name.value,
        email: email.value,
        phoneno: phoneno.value,
        address: address.value
    }
    console.log(payload);

    const url = '/addRecords';
    const options = {
        method: 'POST',
        body: JSON.stringify(payload)
    }

    console.log(options);

    await fetch(url, options).then(async (response) => {
        data = await response.json();
        if (data.flag == true) {
            message.innerHTML = data.message;
        }
        else {
            message.innerHTML = data.error;
        }
    });
};

const editRecords = async (ID) => {

    showInfo.click();

    let payload = {
        name: Name.value,
        email: email.value,
        phoneno: phoneno.value,
        address: address.value
    }
    console.log(payload);

    const url = `/editRecords/${ID}`;
    const options = {
        method: 'POST',
        body: JSON.stringify(payload)
    }

    console.log(options);

    await fetch(url, options).then(async (response) => {
        data = await response.json();
        if (data.flag == true) {
            message.innerHTML = data.message;
        }
        else {
            message.innerHTML = data.error;
        }
    });
};

const getRecords = async () => {
    await fetch('/getRecords').then(async (response) => {
        data = await response.json();
        if (data.flag == false) {
            $("table").find("tr:gt(0)").remove();
            connectionStatus.innerHTML = "Failed to Connect";
            debug.innerHTML = "Note: <br>1. You can reconfigure the database credentials by clicking on the <strong>Connect</strong> button.\
            <br>2. You can also check if port <strong>5432</strong> is being forwarded through your terminal."
        } else {
            $("table").find("tr:gt(0)").remove();
            connectionStatus.innerHTML = "Connected";
            if (data.length == 0) {
                debug.innerHTML = "Note: Click on <strong>Add</strong> to add data to the database table";
            } else {
                data.forEach(element => {
                    var row = tableRef.insertRow();
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    var cell6 = row.insertCell(5);
                    var cell7 = row.insertCell(6);

                    cell1.innerHTML = "";

                    cell2.innerHTML = element.id;

                    cell3.innerHTML = element.name;

                    cell4.innerHTML = element.email;

                    cell5.innerHTML = element.phoneno;

                    cell6.innerHTML = element.address;

                    cell7.innerHTML = `

                <button
                    style="float: right;"
                    onclick="deleteRecords('${element.id}')"
                    class="bx--btn bx--btn--ghost bx--btn--icon-only bx--tooltip__trigger bx--tooltip--a11y bx--tooltip--bottom bx--tooltip--align-center  bx--btn--sm">
                    <span class="bx--assistive-text">Delete</span>
                    <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--btn__icon" width="16" height="16" viewBox="0 0 32 32" aria-hidden="true">
                    <defs><style>.cls-1{fill:none;}</style></defs><title>trash-can</title>
                    <rect x="12" y="12" width="2" height="12"/><rect x="18" y="12" width="2" height="12"/>
                    <path d="M4,6V8H6V28a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V8h2V6ZM8,28V8H24V28Z"/><rect x="12" y="2" width="8" height="2"/>
                    <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"/>
                    </svg>
                </button>
                
                <button
                style="float: right;"
                onclick="Edit('${element.id}')"
                class="bx--btn bx--btn--ghost bx--btn--icon-only bx--tooltip__trigger bx--tooltip--a11y bx--tooltip--bottom bx--tooltip--align-center  bx--btn--sm">
                <span class="bx--assistive-text">Edit</span>
                <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--btn__icon" width="16" height="16" viewBox="0 0 28 28" aria-hidden="true">
                <path d="M25.4,9c0.8-0.8,0.8-2,0-2.8c0,0,0,0,0,0l-3.6-3.6c-0.8-0.8-2-0.8-2.8,0c0,0,0,0,0,0l-15,15V24h6.4L25.4,9z M20.4,4L24,7.6l-3,3L17.4,7L20.4,4z M6,22v-3.6l10-10l3.6,3.6l-10,10H6z"/>
                </svg>
            </button>`;
                    addSerialNumber();

                });
            }
        }
    });
};

const Edit = (id) => {
    data.forEach(element => {
        if (element.id == id) {

            addRecordBtn.click();
            add_edit.innerHTML = "Edit Employee Details";
            Name.value = element.name;
            email.value = element.email;
            phoneno.value = element.phoneno;
            address.value = element.address;
            type = `edit/${id}`;
        }
    });
};

const deleteRecords = async (id) => {
    showInfo.click();
    const url = `/deleteRecords/${id}`;

    await fetch(url).then(async (response) => {
        data = await response.json();
        if (data.flag == true) {
            message.innerHTML = data.message;
        }
        else {
            message.innerHTML = data.error;
        }
    });
};

const addSerialNumber = () => {
    $('table tr').each(function (index) {
        $(this).find('td:nth-child(1)').html(index);
    });
};

const addConnection = async () => {
    showInfo.click();

    let payload = {
        db: selectDb.value,
        dbName: dbName.value,
        username: username.value,
        password: password.value,
        hostname: hostname.value,
        port: port.value
    }
    console.log(payload);

    const url = `/conn`;
    const options = {
        method: 'POST',
        body: JSON.stringify(payload)
    }

    console.log(options);

    await fetch(url, options).then(async (response) => {
        data = await response.json();
        if (data.flag == true) {
            message.innerHTML = data.message;
        }
        else {
            message.innerHTML = data.error;
        }
    });
};

const createTable = async () => {
    const url = `/createTable`;

    await fetch(url).then(async (response) => {
        data = await response.json();
        if (data.flag == true) {
            console.log(data.message);
            getRecords();
        }
        else {
            $("table").find("tr:gt(0)").remove();
            connectionStatus.innerHTML = "Failed to Connect";
            debug.innerHTML = "Note: <br>1. You can reconfigure the database credentials by clicking on the <strong>Connect</strong> button.\
            <br>2. You can also check if port <strong>5432</strong> is being forwarded through your terminal."
        }
    });
};

const getCurrentConnection = async () => {
    const url = `/getCurrentConnection`;

    await fetch(url).then(async (response) => {
        data = await response.json();
        if (data.flag == false){
            // selectDb.value = "";
            // dbName.value = "";
            // username.value = "";
            // password.value = "";
            // hostname.value = "";
            // port.value = "";
        }else {
        
        selectDb.value = data.db;
        dbName.value = data.dbName;
        username.value = data.username;
        password.value = data.password;
        hostname.value = data.hostname;
        port.value = data.port;
    }
    });
};