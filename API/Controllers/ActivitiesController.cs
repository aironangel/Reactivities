using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
  public class ActivitiesController : BaseApiController
  {
    private DataContext _context;

    public ActivitiesController(DataContext context)
    {
      _context = context;
    }

    ///this method returns the list of Actions
    [HttpGet]
    public async Task<ActionResult<List<Activity>>> GetActivities()
    {
      return await _context.Activities.ToListAsync();
    }

    ///AM - 14 - this method returns the list of Actions, the parameter name must match on the definition
    [HttpGet("{id}")]
    public async Task<ActionResult<Activity>> GetActivities(Guid id)
    {
      return await _context.Activities.FindAsync(id);
    }

  }
}