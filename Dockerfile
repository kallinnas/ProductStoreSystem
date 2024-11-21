# Use the official .NET 6 SDK image for building the app
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the main project file and restore dependencies
COPY ProductStoreSystemAPI/*.csproj ./ProductStoreSystemAPI/
RUN dotnet restore ./ProductStoreSystemAPI/ProductStoreSystemAPI.csproj

# Copy the entire backend project
COPY ProductStoreSystemAPI ./ProductStoreSystemAPI

# Build the project in Release mode
RUN dotnet publish ./ProductStoreSystemAPI/ProductStoreSystemAPI.csproj -c Release -o /app/out

# Use the official .NET 6 runtime image for deployment
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime

# Set the working directory in the container
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app/out .

# Expose ports (5000 for HTTP, 5001 for HTTPS)
EXPOSE 5000
EXPOSE 5001

# Set the entry point for the application
ENTRYPOINT ["dotnet", "ProductStoreSystemAPI.dll"]
