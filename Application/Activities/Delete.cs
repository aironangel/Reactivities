using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Activities
{
  public class Delete
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; }
    }

    public class Handler : ActivityHandlerBase, IRequestHandler<Command>
    {

      public Handler(DataContext context) : base(context)
      {

      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        var activity = await _context.Activities.FindAsync(request.Id);

        _context.Remove(activity);
        await _context.SaveChangesAsync();

        return Unit.Value;

      }
    }

  }
}