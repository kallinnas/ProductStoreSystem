# Use the official .NET 6 SDK image as the base image for building the app
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the main project file into the container
COPY ./ProductStoreSystemAPI/*.csproj ./ProductStoreSystemAPI/

# Restore the project dependencies
RUN dotnet restore ./ProductStoreSystemAPI/ProductStoreSystemAPI.csproj

# Copy the entire project into the container
COPY ./ProductStoreSystemAPI ./ProductStoreSystemAPI

# Build the project
RUN dotnet publish ./ProductStoreSystemAPI/ProductStoreSystemAPI.csproj -c Release -o /app/out

# Use a smaller runtime image for deployment
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime

# Set the working directory in the runtime container
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app/out .

# Expose port 5000 for HTTP and 5001 for HTTPS
EXPOSE 5000
EXPOSE 5001

# Specify the entry point for the app
ENTRYPOINT ["dotnet", "ProductStoreSystemAPI.dll"]
