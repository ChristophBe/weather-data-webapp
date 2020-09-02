# Weather Data Web-App

This Software is part of [weather-data-system](https://github.com/ChristophBe/weather-data-system).
This Repository the code for a Web-App that can display weather data that is served by [weather-data-server](https://github.com/ChristophBe/weather-data-server) 

## Run and Build  
Us can run this Webapp by using the provided Dockerfile. 
Build: `docker build –t weather-data-webapp .`
Run: `docker run –it weather-data-webapp`  

 
## Configuration
This Web-App needs an configuration file called `config.prod.json` for an production system  and `config.dev.json` for an development environment. This files are located in the `src` folder . You can create your configuration files by copying the `src/config.sample.json` and chage your informations. 
