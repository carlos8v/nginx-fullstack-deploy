## Project
A fullstack project boilerplate to show how a javascript stack application would be deployed using [nginx](https://www.nginx.com) and [Docker](https://www.docker.com/).

## Overview
For this project you will have to run `docker-compose up -d` on each project, leaving the `proxy` folder for last.
Each `docker-compose.yml` will build (if image has not been built yet) and run a container exposing port `80`.

The **proxy** folder is the `nginx` server which deals with the routing of the services. Mapping the domain `api.local` to the api application and `web.local` domain to the react application.

Each application have a self-signed ssl certificate to, at best, allow a "safe" experience to the user.

After initializing every service, you can use `docker inspect nginx-fullstack-deploy_proxy` to see the ip address of the nginx server.

```bash
> docker inspect nginx-fullstack-deploy_proxy
...
"Networks": {
  "bridge": {
      "IPAMConfig": null,
      "Links": null,
      "Aliases": null,
      "NetworkID": "1ebd948257f9e7d4a3322db9cfe35cd95c7684fe1b7dddcd58d1affd0b7b56de",
      "EndpointID": "fdc45b219cc8ddc1bedd4a05611fc7fb55f6fd33b1d7419a043f9886f8fa2866",
      "Gateway": "172.17.0.1",
      "IPAddress": "172.17.0.2", # <-- This is what we need
...
```

Then simply changing the `/etc/hosts` file to add the applications domains:

`/etc/hosts`
```bash
127.0.0.1   localhost
127.0.1.1   User
172.17.0.2  web.local # Registering web local domain
172.17.0.2  api.local # Registering api local domain
```

Now you should be able to enter on your browser `web.local` and `api.local` url and see services working normally.

#### Api
Simple express server exposing port 80 on the Dockerfile, having a route to `'/'` returning example json response.

#### Web
React boilerplate code exposing port 80 on the Dockerfile.
