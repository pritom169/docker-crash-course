# docker-crash-course

## Docker vs VM
- Docker only controls the Applications layers whereas the VM also controls the Application layer with it#s own os
kernel.
- As a result the docker images are small where as VMs like virtual box are quite large in size
- On the other hand since VM directly talks with host operating sysmtem and it also talks with host hardwares also,
VMs are compatable with any OS, however that is not the case with Docker. On compatability VMs are better than docker.

## Container vs Image
- CONTAINER is the running environment for IMAGE
- CONTAINER has a port which is binded which is running inside a container
- CONTAINER has it's own file system which is different than the host systems which is different from the hosts
file system.

## Pulling Docker image
In order to pull an image, first we need to go to the docker hub. Say we need to import Redis image. We can try
writing the command.

```bash
docker pull redis
```
In this way we are telling docker to give us the latest image.

In order to see all the imgaes in our local device we can give the command
```bash
docker image redis
```

## Running images
Since we have already pulled the redis image let's run the docker image. We can run the docker image simply typing
```bash
docker run redis
```

In order to see all the running images we can simply type
```bash
docker ps
```

In order to see all the images whether they are running or not running we can simply type
```bash
docker ps -a
```

## Stopping a docker image
Stopping a docker image being run is also quite simple. One just can type 'Ctrl+C' inorder to stop the redis image
being running.

## Running a docker image in detached mode
Say one does not want to see the log of docker being run and want to run further images in the same terminal window.
They can run the docker image in detached mode.

```bash
docker run -d redis
```
After running this command we will see the <CONTAINER_ID> in terminal. If we want stop this image being run we can 
simply type

```bash
docker stop <CONTAINER-ID> 
```

## Pulling and Running Docker images simultaneously
Say we want to run another version of docker image and I don't have the image in my local machine. We can type
```bash
docker run redis:7.2.8
```
First it will check the layers of images being already downloaded. It will pull rest of the layers from docker hub.
After all the layers are being downloaded, it will start running the container.

## Port Binding
As we have seen we have pulled two different version of docker images and running them in our local machine. They
both are running on port 6379 which was specified in the image.

The problem arises when we want to give access to outer application access to our redis application. However, we can
do that in a different manner.

The HOST machine docker is hosted has multiple ports. We can attach different ports for our docker images. Say if two
redis image comes with 6379 port. We can bind these two containers with two different host machine port.

Now let's hop into the commands.

```bash
docker run -p6000:6379 -d redis
```

This command binds local host port 6000 to container port 6379. Now if we want to bind different port number to
different image of redis we can simply type

```bash
docker run -p6001:6379 -d redis:7.2.8
```

## Debugging a Container
If we want to see the logs of a running container, we can simply do that using the command

```bash
docker logs <CONTAINER_ID>
```

We can also get the logs of a container using the <CONTAINER_NAME>

```bash
docker logs <CONTAINER_NAME>
```

Say for some reason you want to change the name of the <CONTAINER_NAME>. We can do that by typing

```bash
docker run - d -p6001:6379 --name redis-older redis:7.2.8
```

## Troubleshooting a container
Say there are two containers running and there are some problems with one of the containers. In order to debug
we need to get inside that container and want to get access of that terminal. We can do that simply

```bash
docker exec -it <CONATINER-ID> /bin/bash
```

We can also do it by using the name only.
```bash
docker exec -it <CONTAINER_NAME> /bin/bash
```

One more thing: We can go back for a bit. The command 'docker run' is always used to fetch a container from
docker-hub where as 'docker start' is used to start a paused container.

## A demo workflow with Docker
Let's consider a workflow using Docker container.

- A JS application in the local machine uses MongoDB. Rather than installing MongoDB in the local machine we
download the image from the Docker Hub and install it in the device.
- Now let's say from our local device we want to ship it to the development environment where a tester can
test the app.
- For that we push our app repository to Git.
- That will trigger a CI (a jenkins build). The CI will build the artifact. From the artifact it will create a
docker image.
- Once the docker image is generated, it will get pushed to a private docker repository.
- Now that docker image needs to be deployed in a development server.
- Now the development server pulls the image from the private repository
- It also pulls the Docker image from the docker hub
- As a result, we have two independent container. One for your own JS application and another for Docker.
- So if someone enters the Dev server, they will be able to test the app.

## Docker Network
Docker creates it's own isolated Docker network. Docker creates it's own isolated Docker network where the containers
are running. As a result, when one deploys two container in same Docker network in our case Mongo and Mongo Express, we
can simply connect them just using their name.

When an application which is outside the docker network in our case Nodejs application conntects via 
localhost:port-number.

Finally when we will ship the application we will put the node.js, mongo, and mongo-express UI in their
own container which will reside inside the same docker network.

We can see all the docker network just by typing,

```bash
docker network ls
```
### Create a container for MongoDB

Now let's create one docker network for MongoDB. Here is the command
```bash
docker run -d \                                                                                           
> -p 27017:27017 \
> -e MONGO_INITDB_ROOT_USERNAME=admin \
> -e MONGO_INITDB_ROOT_PASSWORD=password \
> --name mongodb \
> --net mongo-network \
> mongo
```

This command launches a MongoDB database inside a Docker container. Let’s break it down piece by piece:

- **_docker run_** - Creates and starts a new container from an image.

- **_-d_** Runs the container in “detached” mode—i.e., in the background—so your terminal isn’t tied up by its output.

- **_-p 27017:27017_** Maps port 27017 of your host machine (the left side) to port 27017 of the container 
(the right side). MongoDB listens by default on port 27017, so this makes the database accessible at localhost:27017 
on your computer.

- **_-e MONGO_INITDB_ROOT_USERNAME=admin_** Sets the environment variable MONGO_INITDB_ROOT_USERNAME inside the 
container to admin. During the first startup, the official MongoDB image uses this to create your root user.

- **_-e MONGO_INITDB_ROOT_PASSWORD=password_** Similarly sets MONGO_INITDB_ROOT_PASSWORD to password. Together with 
the username, this establishes your admin credentials.

- **_--name mongodb_** Assigns the name mongodb to the running container. You can then refer to it by name in other 
Docker commands (e.g., docker stop mongodb).

- **_--net mongo-network_** Attaches the container to a user-defined Docker network called mongo-network. This is 
useful if you have other containers (e.g., an application server) on the same network that need to talk to MongoDB 
by container name.

- **_mongo_** Specifies which Docker image to use; here it’s the official mongo image from Docker Hub. If you don’t have 
it locally, Docker will pull it automatically.

### Create a container for Mongo Express
```bash
docker run -d \
> -p 8081:8081 \
> -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin \
> -e ME_CONFIG_MONGODB_ADMINPASSWORD=password \
> --net mongo-network \
> --name mongo-express \
> -e ME_CONFIG_MONGODB_SERVER=mongodb \
> mongo-express
```

- `docker run -d` - Command for running docker in detached mode
- `-p 8081:8081` - The port it should bind
- `-e ME_CONFIG_MONGODB_ADMINUSERNAME=admin -e ME_CONFIG_MONGODB_ADMINPASSWORD=password` - Setting up the environment
variable for MongoDB
- `--net mongo-network` - The container should be in the mongo-network. If the network is not created, it will create
a new network.
- `--name mongo-express`- The name of the container should be mongo express
- `-e ME_CONFIG_MONGODB_SERVER=mongodb` - it tells Mongo express about the server (the container name of the server)
- `mongo-express` - last but not the least we have to mention the image name

## Docker compose
As we have seen we have manually set up the commands for Docker, however doing this everytime and setting up things
manually is quite cumbersome. Here comes Docker Compose.

In few words, Docker compose is a structured way to format Docker commands. Since Docker Compose happens in a .yaml,
file it is much convenient edit.

Here is the transferred content of what we had already written in a file name `mongo.yaml`:

```yaml
version: "3"
services:
  mongodb:
    image: mongo
    ports:
      - 27017:27017
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
  mongo-express:
    image: mongo-express
    ports:
      - 8080:8081
    environment:
      - ME_CONFIG_MONGODB_ADMINUSERNAME=admin
      - ME_CONFIG_MONGODB_ADMINPASSWORD=password
      - ME_CONFIG_MONGODB_SERVER=mongodb
```
