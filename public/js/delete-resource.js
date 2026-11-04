function deleteResource(id) {

    // Ask the user to confirm deletion before proceeding
    if (!confirm("Are you sure you want to delete this resource?")) {
        return; // Exit function if user cancels
    }

    // Configure request as DELETE to the delete-resource endpoint with the resource ID
    var request = new XMLHttpRequest();

    request.open("DELETE", "/delete-resource/" + id, true);
    request.setRequestHeader("Content-Type", "application/json");

    request.onload = function () {
        var response = JSON.parse(request.responseText);

        // Check if deletion was successful
        if (request.status === 200) {
            alert(response.message);

            // Refresh the table to reflect the deleted resource
            viewResources();

        } else {
            // Show error message if deletion failed
            alert(response.message || "Unable to delete resource.");
        }
    };

    request.send();
}