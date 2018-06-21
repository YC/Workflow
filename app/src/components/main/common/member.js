// Helper functions for processing members

// Returns the member's inititals
export let getMemberInitials = member => {
    return member.firstname.charAt(0) + member.lastname.charAt(0);
};

// Composes a member's name
export let composeName = member => {
    return member.firstname + ' ' + member.lastname;
};

// Finds unretrieved members
export let getUnretrievedMembers = (members, memberIDs) => {
    // Find all members who are not in 'members' and return them
    return memberIDs.filter(memberID => !members[memberID]);
};

// Extract a member by their username from the given members object
export let getMember = (members, username) => {
    // Loop through members and find member with matching username
    for (let memberID of Object.keys(members)) {
        if (members[memberID].username === username) {
            return members[memberID];
        }
    }
    return null;
};
