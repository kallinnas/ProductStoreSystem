# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app
COPY . ./
RUN dotnet restore
RUN dotnet build -c Release --no-restore

# Stage 2: Publish the application
RUN dotnet publish -c Release -o /app/publish --no-build --no-restore

# Stage 3: Setup the runtime container
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "YourAppName.dll"]
