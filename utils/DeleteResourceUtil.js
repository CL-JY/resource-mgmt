
const fs = require('fs').promises;
const path = require('path');
const RESOURCES_FILE = path.join('utils', 'resources.json');

async function deleteResource(req, res) {
    try {
        const { id } = req.params;
        let resources = [];

        try {
            const data = await fs.readFile(RESOURCES_FILE, 'utf8');
            resources = JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({
                    message: 'No resources found to delete.'
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

        const deletedResource = resources.splice(resourceIndex, 1)[0];

        await fs.writeFile(
            RESOURCES_FILE,
            JSON.stringify(resources, null, 2),
            'utf8'
        );

        return res.status(200).json({
            message: 'Resource deleted successfully!'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
}


// Function to delete a resource by its ID
function confirmDeleteResource(id) {

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

        // If deletion was successful, show a confirmation
        if (request.status === 200) {
            alert(response.message);
            viewResources(); // Refresh the table to reflect the deleted resource
        } else {
            // Show error message if deletion failed
            alert(response.message || "Unable to delete resource.");
        }
    };

    request.send();
}

module.exports = { deleteResource };
