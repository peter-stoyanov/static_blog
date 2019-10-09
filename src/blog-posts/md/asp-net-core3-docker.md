# Asp.Net Core 3 and PostgreSQL on Docker

This is more or less a proof of concept of deploying Asp.Net Core 3.0 with PostgreSQL with Docker.

## The API

It's a simple web API project with only one restfull endpoint: /user.
It uses Entity Framework Core and the adapter for PostgreSQL.
What I had problems with was the port binding when the app is deployed in container.
I wanted to expose port 5000.
The fix was to be more specific about it when bootstrapping the app:

```c#
public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseUrls("http://*:5000");
                    webBuilder.UseStartup<Startup>();
                });
```


## The database

I decided on using PostgreSQL due to the simplicity of installation and JSON support.
The only thing I had to do is configure it as one of the services in the docker-compose file:

```yml
services:
  postgres:
    image: postgres
    container_name: restapi-postgres
    ports:
      - 7654:5432
    volumes:
      - /postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: p0stgreS
      POSTGRES_USER: p0stgreS
      POSTGRES_PASSWORD: p0stgreS
```

Key points here is to expose some port on the host which will be mapped to the default port the database is using which is 5432 from within the container. Make sure also to mount a volume so that the data in the database is kept between restarts of the container. And last point here - keep note of the name you give to the database container, we'll need it later.

## Building an image

To build an image from your Asp.Net Core API code you'll need this Docker file:

```yml
FROM mcr.microsoft.com/dotnet/core/sdk:3.0 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.0
WORKDIR /app
COPY --from=build-env /app/out .

EXPOSE 5000/tcp
ENV ASPNETCORE_URLS http://*:5000

ENTRYPOINT ["dotnet", "dotnet-api.dll"]
```

First we build the image providing a name and passig the current folder as build context to the docker build engine:

```cli
docker build -t api .
```

After this we can tag the image with our repository name from docker hub so we can upload it later:

```cli
docker tag api peshostoyanov/api
```

To access our repo we need to authenticate:

```cli
docker login --username=peshostoyanov
```

And finally push the image to docker hub:

```cli
docker push peshostoyanov/api:latest
```

## Make them work together

We need to add the web app container to the docker-compose.yml:

```yml
 web:
    image: peshostoyanov/api:latest
    container_name: restapi
    ports:
      - 5000:5000
    restart: always
```

I am not sure if restart is needed here, but without it I had issues from the database starting after the app and error in the app because of that.

The final touch is to point your app to the database. It turns out the containers run by docker compose are placed in a common private network and assigned different IP addresses. One container is accessible by the others by its name, which will resolve through DNS to the dynamically assigned IP address. To take this into account we need to change the connection string in the app and point to the name we gave to the DB container:

```c#
"connectionStrings": {
    "defaultConnection": "server=restapi-postgres;database=XX;....."
  }
```

## Run and enjoy

In my case I booted a Linode linux machine with pre-installed docker-compose. Transferred the docker-compose.yml file to it and the only thing left is to run it:

```cli
docker-compose up
```

I didn't use the daemon mode (-d) in order to see any errors directly in the terminal.

After that I was able to reach the endpoint at `http://<your machine IP>/user`

The ease with which such software components can be created, configured and run in isolation is out of this world.




