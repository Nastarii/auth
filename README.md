# Auth Microservice

The goal of this project is to create a simple and intuitive authentication microservice for general purpose

## Installation Guide

Tool:

* Docker
    *  This project uses:
        - node >= 20.6 
        - mysql = 8.2.0 
        **Obs.** if you dont want to use docker

## Usage with Node

to start the project with node type the command:

### 1º Install packages
```
    npm init
```
### 2º Run backend

```
    node --env-file=.env app.js
```

you can use node with mysql docker image or the normal version 

### Mysql docker container command

```
    docker run -it --name mysql-container --env-file .env -p 3306:3306 mysql:8.2.0
```

### Node docker image

```
    docker build . -t auth-backend
```

```
    docker run -it --name backend-container -p 3000:3000 auth-backend
```

### Mysql normal version

https://www.mysql.com/downloads/

## Usage with docker

```
    docker compose up
```
