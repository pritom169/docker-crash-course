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






