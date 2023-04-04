using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Persistence;

namespace Application.Activities
{
  public abstract class ActivityHandlerBase
  {
    protected readonly DataContext _context;

    protected readonly IMapper _mapper;

    protected ActivityHandlerBase(DataContext context) : this(context, null)
    {

    }

    protected ActivityHandlerBase(DataContext context, IMapper mapper)
    {
      _mapper = mapper;
      _context = context;
    }

  }
}