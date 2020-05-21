const groupForm = document.getElementById('group');
const select = document.getElementById('room');

const socket = io();

groupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Get group name
    const groupName = e.target.elements.groupName.value;
    e.target.elements.groupName.value = '';

    //Send group name to server
    socket.emit('newGroup', groupName);

    //Display all groups
    socket.on('groupData', groups => {
        outputGroups(groups);
    });
});


function outputGroups(groups) {
    var items = Object.values(groups);
    items.map(value => {
        var option = document.createElement("OPTION");
        option.innerHTML = value;
        option.value = value;
        select.appendChild(option);
       });
}