# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app
COPY . ./
RUN dotnet restore
RUN dotnet build -c Release --no-restore
RUN dotnet publish -c Release -o /app/publish --no-build --no-restore

# Stage 2: Setup the runtime container
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app/publish .

# Apply database migrations
RUN dotnet ef database update --no-build --environment Production

ENTRYPOINT ["dotnet", "ProductStoreSystemAPI.dll"]
