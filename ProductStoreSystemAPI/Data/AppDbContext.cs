﻿using Microsoft.EntityFrameworkCore;
using ProductStoreSystemAPI.Models;

namespace ProductStoreSystemAPI.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public virtual DbSet<Connection_Ps> Connections_Ps { get; set; }
    public virtual DbSet<User_Ps> Users_Ps { get; set; }
    public virtual DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User_Ps>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("users_ps");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .HasColumnName("email");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(60)
                .HasColumnName("passwordHash");
            entity.Property(e => e.Role).HasColumnName("role");

            entity.HasMany(e => e.Connections)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Connection_Ps>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("connections_ps");

            entity.HasIndex(e => e.UserId, "userId");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.SignalrId)
                .HasMaxLength(22)
                .HasColumnName("signalrId");
            entity.Property(e => e.TimeStamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("timeStamp");
            entity.Property(e => e.UserId).HasColumnName("userId");

            entity.HasOne(d => d.User)
                .WithMany(p => p.Connections)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("products");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Desc)
                .HasMaxLength(100)
                .HasColumnName("desc");
            entity.Property(e => e.Image).HasColumnName("image");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.Price).HasColumnType("numeric")
                .HasPrecision(10, 2)
                .HasColumnName("price");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
