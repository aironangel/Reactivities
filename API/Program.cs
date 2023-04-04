using Microsoft.EntityFrameworkCore;
using Persistence;
using MediatR;
using Application.Activities;
using API.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 7 - AM - COMMENT TO USE ONLY HTTP
//app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthorization();

// 7 - AM - Map the controllers
app.MapControllers();

// 12 - AM - Create/Update database
// 12 - AM - The using of scope means that when variabile is finished to use all the entities will be destroyed
using var scope = app.Services.CreateScope();
var service = scope.ServiceProvider;
try
{
    var context = service.GetRequiredService<DataContext>();
    //13 - AM - Use Seed to seed data in async mode. Also the migrate option can be made asynchronously using the metod MigrateAsync
    await context.Database.MigrateAsync();
    await Seed.SeedData(context);
}
catch (Exception ex)
{
    var logger = service.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured on database migration");
}

app.Run();
