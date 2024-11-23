# Use the official .NET 6 SDK image for building the app
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

# Set the working directory in the container
WORKDIR /src

# Copy the main project file and restore dependencies
COPY ProductStoreSystemAPI/*.csproj ./ProductStoreSystemAPI/
RUN dotnet restore ./ProductStoreSystemAPI/ProductStoreSystemAPI.csproj

# Copy the entire backend project
COPY ProductStoreSystemAPI ./ProductStoreSystemAPI

# Build the project in Release mode
RUN dotnet publish ./ProductStoreSystemAPI/ProductStoreSystemAPI.csproj -c Release -o /app

# Use the official .NET 6 runtime image for deployment
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime

# Set the working directory in the container
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app .

# Expose ports for Railway to map
EXPOSE 80
EXPOSE 443

# Environment variables for Railway MySQL database
ENV ASPNETCORE_URLS=http://+:80
ENV SIGNALR_MYSQL_CONNECTION_STRING="server=${MYSQLHOST};port=${MYSQLPORT};database=${MYSQLDATABASE};user=${MYSQLUSER};password=${MYSQLPASSWORD}"

# Set the entry point for the application
ENTRYPOINT ["dotnet", "ProductStoreSystemAPI.dll"]
