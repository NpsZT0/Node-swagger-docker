const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'The node.js backend application',
            version: '1.0.0',
            description: `API Description a users must be register and login before use The products API\n
 GitHub repository for the project: [Workshop Backend Developer](https://github.com/swagger-api/swagger-petstore)`,
        },
        servers: [
            { url: 'http://localhost:3000' }
        ],
    },
    apis: ['./src/api/routes/*.js'], // Path to the API routes in application
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;