# Use the official .NET 6 SDK image for building the app
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the main project file and restore dependencies
COPY ./ProductStoreSystemAPI/ProductStoreSystemAPI.sln ./ProductStoreSystemAPI/
COPY ./ProductStoreSystemAPI/*.csproj ./ProductStoreSystemAPI/
COPY ./ProductStoreSystemAPI/ ./ProductStoreSystemAPI/

WORKDIR /app/ProductStoreSystemAPI
RUN dotnet restore
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app/ProductStoreSystemAPI/out .

# Expose ports for Railway to map
EXPOSE 80

# Set the entry point for the application
ENTRYPOINT ["dotnet", "ProductStoreSystemAPI.dll"]
