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

``` bash
docker pull redis
```
In this way we are telling docker to give us the latest image.

In order to see all the imgaes in our local device we can give the command
``` bash
docker image redis
```

## Running images
Since we have already pulled the redis image let's run the docker image. We can run the docker image simply typing
``` bash
docker run redis
```

In order to see all the running images we can simply type
``` bash
docker ps
```

In order to see all the images whether they are running or not running we can simply type
``` bash
docker ps -a
```

## Stopping a docker image
Stopping a docker image being run is also quite simple. One just can type 'Ctrl+C' inorder to stop the redis image
being running.

## Running a docker image in detached mode
Say one does not want to see the log of docker being run and want to run further images in the same terminal window.
They can run the docker image in detached mode.

``` bash
docker run -d redis
```
After running this command we will see the <CONTAINER_ID> in terminal. If we want stop this image being run we can 
simply type

``` bash
docker stop <CONTAINER-ID> 
```

## Pulling and Running Docker images simultaneously
Say we want to run another version of docker image and I don't have the image in my local machine. We can type
``` bash
docker run redis:7.2.8
```
First it will check the layers of images being already downloaded. It will pull rest of the layers from docker hub.
After all the layers are being downloaded, it will start running the container.



