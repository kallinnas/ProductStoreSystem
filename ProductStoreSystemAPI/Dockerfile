# Base image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime

# Install required packages
RUN apt-get update && apt-get install -y default-mysql-client

# Copy application files
WORKDIR /app
COPY . /app

# Expose ports and start application
EXPOSE 80
ENTRYPOINT ["dotnet", "ProductStoreSystemAPI.dll"]

