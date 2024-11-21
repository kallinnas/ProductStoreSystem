# Add Angular build
FROM node:16 AS angular-build
WORKDIR /app
COPY ./ProductStoreSystemUI ./ProductStoreSystemUI
RUN cd ProductStoreSystemUI && npm install && npm run build --prod

# Add ASP.NET build
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app
COPY ./ProductStoreSystemAPI/*.csproj ./ProductStoreSystemAPI/
RUN dotnet restore ./ProductStoreSystemAPI/ProductStoreSystemAPI.csproj
COPY ./ProductStoreSystemAPI ./ProductStoreSystemAPI
RUN dotnet publish ./ProductStoreSystemAPI/ProductStoreSystemAPI.csproj -c Release -o /app/out

# Final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .
COPY --from=angular-build /app/ProductStoreSystemUI/dist /app/wwwroot
EXPOSE 5000
EXPOSE 5001
ENTRYPOINT ["dotnet", "ProductStoreSystemAPI.dll"]
