# **nodejs & MySQL** 

## Introduction 
Creation of APIs to bridge between front-end application and MySQl database 

### Prerequisites
- **Node.js and npm** installed: React relies on [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). (Node Package Manager) for managing dependencies and running build scripts. Make sure you have both installed on your system before proceeding with React installation. 
- Link to **MySQL** Installation Guide [click here](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/) 

### Basic project creation 
```shell 
npm init -y 
``` 

## nodejs required plugins 
Add `express` for creation of API end-points 
```shell 
npm install express 
```
Add `mysql` for MySQL ORM 
```shell 
npm install mysql 
``` 
Add `jsonwebtoken` for JWT authentication 
```shell 
npm install jsonwebtoken 
``` 
Add `swagger-jsdoc swagger-ui-express` for swagger doc creation and swagger UI 
```shell 
npm install swagger-jsdoc swagger-ui-express 
``` 
Add `cors` for Cross-Origin Resource Sharing (CORS) rectification 
```shell 
npm install cors 
``` 
Add `oracledb` for Oracle DB ORM 
```shell 
npm install oracledb 
``` 

## Application run 
Run application with entry point nodjs file like `app.js` 
```shell 
node app.js 
``` 