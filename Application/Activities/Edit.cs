using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
  public class Edit
  {
    public class Command : IRequest
    {
      public Activity Activity { get; set; }
    }

    public class Handler : ActivityHandlerBase, IRequestHandler<Command>
    {
      public Handler(DataContext context, IMapper mapper) : base(context, mapper)
      {

      }

    
      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        var activity = await _context.Activities.FindAsync(request.Activity.Id);
        _mapper.Map(request.Activity, activity);

        await _context.SaveChangesAsync();
        return Unit.Value;
      }
    }

  }
}