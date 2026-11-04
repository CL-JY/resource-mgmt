
const fs = require('fs').promises;
const path = require('path');
const RESOURCES_FILE = path.join('utils', 'resources.json');

async function editResource(req, res) {
    try {
        const { id } = req.params;
        const { name, location, description, owner } = req.body;
        let resources = [];

        try {
            const data = await fs.readFile(RESOURCES_FILE, 'utf8');
            resources = JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({
                    message: 'No resources found to edit.'
                });
            } else {
                throw err;
            }
        }

        const resourceIndex = resources.findIndex(r => r.id == id);

        if (resourceIndex === -1) {
            return res.status(404).json({
                message: 'Resource not found.'
            });
        }

        // Update resource fields
        resources[resourceIndex] = {
            ...resources[resourceIndex],
            name: name || resources[resourceIndex].name,
            location: location || resources[resourceIndex].location,
            description: description || resources[resourceIndex].description,
            owner: owner || resources[resourceIndex].owner
        };

        await fs.writeFile(
            RESOURCES_FILE,
            JSON.stringify(resources, null, 2),
            'utf8'
        );

        return res.status(200).json({
            message: 'Resource updated successfully!',
            resource: resources[resourceIndex]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
}

// Function to open the edit modal and pre-fill it with the selected resource's data
function openEditResource(data) {
    var selectedResource = JSON.parse(data);

    // Pre-fill the modal input fields with the current resource details
    document.getElementById("editName").value = selectedResource.name;
    document.getElementById("editLocation").value = selectedResource.location;
    document.getElementById("editDescription").value =
        selectedResource.description;
    document.getElementById("editOwner").value = selectedResource.owner;

    // Set update button's onclick attribute to call updateResource() with resource's ID
    document.getElementById("updateButton").setAttribute(
        "onclick",
        'updateResource("' + selectedResource.id + '")'
    );

    // Show the edit modal using Bootstrap's modal method
    $('#editResourceModal').modal('show');
}


// Function to send updated resource data to the backend API
function updateResource(id) {
    var response = "";

    // Create a JSON object from the modal input fields
    var jsonData = {
        name: document.getElementById("editName").value,
        location: document.getElementById("editLocation").value,
        description: document.getElementById("editDescription").value,
        owner: document.getElementById("editOwner").value
    };

    // Basic validation to ensure all fields are filled
    if (jsonData.name == "" || jsonData.location == "" || jsonData.description
        == "" || jsonData.owner == "") {
        alert('All fields are required!');
        return;
    }

    // Configure the request as PUT to the edit-resource endpoint with the resource ID
    var request = new XMLHttpRequest();
    request.open("PUT", "/edit-resource/" + id, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);

        // If the backend confirms success, show an alert and reload the page
        if (response.message == "Resource updated successfully!") {
            alert('Edited Resource: ' + jsonData.name + '!');
            $('#editResourceModal').modal('hide');
            viewResources();
        } else {
            alert('Unable to edit resource!');
        }
    };

    // Send the JSON data to the server
    request.send(JSON.stringify(jsonData));
}

module.exports = { editResource };
