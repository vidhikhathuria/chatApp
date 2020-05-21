const groups = ['defaultGroup']

function appendNewGroup(groupName) {
    groups.push(groupName);

    return groups;
}

function listOfGroups() {
    return groups;
}

module.exports = {
    appendNewGroup,
    listOfGroups
}