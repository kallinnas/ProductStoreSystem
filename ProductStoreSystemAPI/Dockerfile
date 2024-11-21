# Use the official .NET SDK (includes build tools) for building the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Install dotnet-ef tool globally for database migrations
RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

# Copy project files to the container
COPY . ./

# Restore dependencies
RUN dotnet restore

# Build the application in Release mode
RUN dotnet publish -c Release -o out --no-restore

# Use a lightweight runtime image for running the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Install MySQL client for database interactions if necessary
RUN apt-get update && apt-get install -y default-mysql-client && apt-get clean

# Copy the published application from the build stage
COPY --from=build /app/out ./

# Expose port 80 for the application
EXPOSE 80

# Set environment variables for runtime
ENV ASPNETCORE_ENVIRONMENT=Production
ENV SIGNALR_MYSQL_CONNECTION_STRING="server=autorack.proxy.rlwy.net;port=34922;database=railway;user=root;password=PWBPzByrfeFRiZcaROtUASpbjFAfUJhk"

# Start the application
ENTRYPOINT ["dotnet", "ProductStoreSystemAPI.dll"]
