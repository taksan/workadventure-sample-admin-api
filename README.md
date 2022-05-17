# workadventure-sample-admin-api

This project is a very minimal example of a working AdminAPI implementation for [WorkAdventure](https://github.com/thecodingmachine/workadventure/).

This is not supposed to be a role model implementation, this is just to illustrate the bare bones as a way to understand how it works.

## Using with workadventure in dev-mode

1. Clone [WorkAdventure](https://github.com/thecodingmachine/workadventure/)
1. Copy this project folder under the workadventure workspace naming it `admin`
1. Change docker-compose.yml to add the following section:

    ```yaml
    admin:
        image: thecodingmachine/nodejs:16
        command: yarn run start
        volumes:
        - ./admin:/usr/src/app
        labels:
        - "traefik.enable=true"
        - "traefik.http.routers.admin.rule=Host(`admin.workadventure.localhost`)"
        - "traefik.http.routers.admin.entryPoints=web"
        - "traefik.http.services.admin.loadbalancer.server.port=8080"
        - "traefik.http.routers.admin-ssl.rule=Host(`admin.workadventure.localhost`)"
        - "traefik.http.routers.admin-ssl.entryPoints=websecure"
        - "traefik.http.routers.admin-ssl.tls=true"
        - "traefik.http.routers.admin-ssl.service=admin"
    ```

1. Change the pusher definition in docker-compose.yml to add  the following environment variable:

    ```yaml
    ADMIN_API_URL: http://admin:8080
    ```

1. Copy the the file `./pusher/data/woka.json` to the admin folder

1. Fire it up

## Testing

Now that you are done, just head up to your local [instance](http://play.workadventure.localhost). Only the firt woka will
be available for selection in this example and will be used regardless of your selection. As for the room URL, you can use
anything in the form `/_/*`. Whatever you use, the starter map will be loaded.
