using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    // 8 - AM - attribute for making controller
    [ApiController]
    // 8 - AM - Route to map the controller to the first part of name: localhost:5000/weatherforecast
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        public IMediator Mediator => _mediator ??= 
            HttpContext.RequestServices.GetService<IMediator>();

    }
}