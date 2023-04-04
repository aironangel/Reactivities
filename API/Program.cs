using Microsoft.EntityFrameworkCore;
using Persistence;
using MediatR;
using Application.Activities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DataContext>(dbOption => 
{
    dbOption.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors(opt => 
{
  opt.AddPolicy("CorsPolicy", policy =>
  {
    policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
  });
});

builder.Services.AddMediatR(typeof(List.Handler));
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

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
