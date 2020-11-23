using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using Vouzamo.UXC.App.Models;

namespace Vouzamo.UXC.App.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ItemsController : ControllerBase
    {
        private ItemHierarchy Hierarchy { get; }

        public ItemsController(ItemHierarchy hierarchy)
        {
            Hierarchy = hierarchy;
        }

        [HttpGet]
        public IEnumerable<SpaceItem> GetSpaces()
        {
            return Hierarchy.GetSpaces();
        }

        [HttpGet("{id}/children")]
        public IEnumerable<Item> GetChildItems(Guid id)
        {
            return Hierarchy.GetChildItems(id);
        }

        [HttpGet("{id}/breadcrumb")]
        public IEnumerable<Item> GetBreadcrumb(Guid id)
        {
            return Hierarchy.Breadcrumb(id);
        }
    }
}
