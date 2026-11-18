
jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn(),
        writeFile: jest.fn()
    }
}));

// Import required modules and utilities
const fs = require('fs').promises;
const { addResource } = require('../utils/AddResourceUtil');
const { viewResources } = require('../utils/ViewResourceUtil');
const { editResource } = require('../utils/EditResourceUtil');
const { deleteResource } = require('../utils/DeleteResourceUtil');

describe('Unit Tests for Utils', () => {

    // Reset mocks before each test to avoid leaking state between tests
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('addResource should add a resource', async () => {

        // Mock resources.json so it starts as an empty array
        const existingData = JSON.stringify([]);

        fs.readFile.mockResolvedValueOnce(existingData);
        fs.writeFile.mockResolvedValue();

        const req = {
            body: {
                name: 'Test Resource',
                location: 'Room 101',
                description: 'Projector and screen',
                owner: 'user@example.com'
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await addResource(req, res);

        expect(res.status).toHaveBeenCalledWith(201);

        // Extract the response
        const response = res.json.mock.calls[0][0];

        // Verify that the last resource matches our input
        expect(response.length).toEqual(1);
        expect(response[0].name).toEqual('Test Resource');
    });

    it('viewResources should return resources', async () => {

        const mockData = JSON.stringify([
            {
                name: 'Test Resource',
                location: 'Room 101',
                description: 'Projector and screen',
                owner: 'user@example.com'
            }
        ]);

        fs.readFile.mockResolvedValue(mockData);

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await viewResources(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        // Extract the response
        const response = res.json.mock.calls[0][0];

        // Verify that the last resource matches our input
        expect(response.length).toEqual(1);
        expect(response[0].name).toEqual('Test Resource');
    });

    it('editResource should update resource', async () => {

        const mockData = JSON.stringify([
            {
                name: 'Test Resource',
                location: 'Room 101',
                description: 'Projector and screen',
                owner: 'user@example.com',
                id: 1
            }
        ]);

        fs.readFile.mockResolvedValue(mockData);
        fs.writeFile.mockResolvedValue();

        const req = {
            params: {
                id: 1
            },
            body: {
                name: 'Edited Resource Name'
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await editResource(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        // Extract the response
        const response = res.json.mock.calls[0][0];

        // Verify success message and that the last resource matches our input
        expect(response.message).toEqual('Resource updated successfully!');
        expect(response.resource.name).toEqual('Edited Resource Name');
    });

    it('deleteResource should delete resource', async () => {

        const mockData = JSON.stringify([
            {
                name: 'Test Resource',
                location: 'Room 101',
                description: 'Projector and screen',
                owner: 'user@example.com',
                id: 1
            }
        ]);

        fs.readFile.mockResolvedValue(mockData);
        fs.writeFile.mockResolvedValue();

        const req = {
            params: {
                id: 1
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await deleteResource(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        // Extract the response
        const response = res.json.mock.calls[0][0];

        // Verify success message
        expect(response.message).toEqual('Resource deleted successfully!');
    });

});
