# Use the .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copy the solution file and project files
COPY ./ProductStoreSystemAPI/ProductStoreSystemAPI.sln ./ProductStoreSystemAPI/
COPY ./ProductStoreSystemAPI/*.csproj ./ProductStoreSystemAPI/

# Copy the rest of the server files
COPY ./ProductStoreSystemAPI/ ./ProductStoreSystemAPI/

# Restore dependencies
WORKDIR /app/ProductStoreSystemAPI
RUN dotnet restore

# Build and publish the application
RUN dotnet publish -c Release -o out

# Create the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app

# Copy the published application from the build stage
COPY --from=build /app/ProductStoreSystemAPI/out .

# Install MySQL client (if needed for DB interactions, optional)
RUN apt-get update && apt-get install -y mysql-client

# Expose port 80 for the application
EXPOSE 80

# Apply database migrations (if required in production)
RUN dotnet ef database update --no-build --environment Production

# Set the entry point for the application
ENTRYPOINT ["dotnet", "ProductStoreSystemAPI.dll"]
