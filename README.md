# Auth Microservice 🔒

The goal of this project is to create a simple and intuitive authentication microservice for general purpose, using node, mysql and docker.

## Installation Guide

Tool:

* Docker
    *  This project was created with:
        - node >= 20.6 
        - mysql = 8.2.0 
        **Obs.** if you dont want to use docker

First step, rename .env-example to .env and replace it with your data information (passwords and custom settings)

### With Docker

To install the project using docker stack just run the command:

```
    docker compose up
```

but if you want to run the containers separately, follow this steps:

#### Mysql docker container command

```
    docker run -d --name mysql-container --env-file .env -p 3306:3306 mysql:8.2.0
```

#### Create Node docker image

```
    docker build . -t auth-backend
```

#### Run Node image

```
    docker run -d -add-host host.docker.internal:172.17.0.1 --name backend-container -p 3000:3000 auth-backend
```

### With Node (standalone)

To start the project with node type the command:

#### 1º Install packages
```
    npm init
```
#### 2º Run backend

```
    npm start
```

you can use node with mysql docker image or the normal version 

#### 3º Mysql normal version

* https://www.mysql.com/downloads/

## Usage

Currently, the project is still in progress, and we regret to inform you that it is not yet complete. 

Our current estimate is that the project will be ready for launch by the end of January. 
