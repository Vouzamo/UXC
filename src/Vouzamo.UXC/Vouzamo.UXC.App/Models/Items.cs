using System;
using System.Collections.Generic;
using System.Linq;

namespace Vouzamo.UXC.App.Models
{
    [Flags]
    public enum ItemType
    {
        Space = 1,
        Folder = 2,
        Contract = 4,
        Fragment = 8,
        Composition = 16
    }

    public abstract class Item
    {
        public virtual Guid Id { get; protected set; } = Guid.NewGuid();
        public virtual string Name { get; set; } = string.Empty;
        public abstract ItemType Type { get; }
        public abstract ItemType AllowedTypes { get; }
    }

    public abstract class ChildItem : Item
    {
        public Guid ParentId { get; set; }
    }

    public abstract class SlugItem : ChildItem
    {
        public string Slug { get; set; } = string.Empty;
    }

    public class SpaceItem : Item
    {
        public override ItemType Type => ItemType.Space;
        public override ItemType AllowedTypes => ItemType.Folder | ItemType.Contract | ItemType.Fragment | ItemType.Composition;
    }

    public class FolderItem : SlugItem
    {
        public override ItemType Type => ItemType.Folder;
        public override ItemType AllowedTypes => ItemType.Folder | ItemType.Contract | ItemType.Fragment | ItemType.Composition;
    }

    public class ContractItem : ChildItem
    {
        public override ItemType Type => ItemType.Contract;
        public override ItemType AllowedTypes => 0;
    }

    public class FragmentItem : ChildItem
    {
        public override ItemType Type => ItemType.Fragment;
        public override ItemType AllowedTypes => 0;
    }

    public class CompositionItem : SlugItem
    {
        public override ItemType Type => ItemType.Composition;
        public override ItemType AllowedTypes => 0;
    }

    public class ItemHierarchy
    {
        public List<Item> Items { get; set; } = new List<Item>();

        public ItemHierarchy()
        {
            var space = new SpaceItem()
            {
                Name = "My First Space"
            };

            var contentFolder = new FolderItem()
            {
                Name = "Content",
                Slug = "content",
                ParentId = space.Id
            };

            var contract = new ContractItem()
            {
                Name = "Contract",
                ParentId = contentFolder.Id
            };

            var fragment = new FragmentItem()
            {
                Name = "Fragment",
                ParentId = contentFolder.Id
            };

            var homePage = new CompositionItem()
            {
                Name = "Homepage",
                ParentId = space.Id
            };

            var aboutUsPage = new CompositionItem()
            {
                Name = "About Us",
                Slug = "about-us",
                ParentId = space.Id
            };

            var contactUsFolder = new FolderItem()
            {
                Name = "Contact Us",
                Slug = "contact-us",
                ParentId = space.Id
            };

            var contactUsPage = new CompositionItem()
            {
                Name = "Landing Page",
                ParentId = contactUsFolder.Id
            };

            Items.Add(space);
            Items.Add(contentFolder);
            Items.Add(contract);
            Items.Add(fragment);
            Items.Add(homePage);
            Items.Add(aboutUsPage);
            Items.Add(contactUsFolder);
            Items.Add(contactUsPage);
        }

        public IEnumerable<SpaceItem> GetSpaces()
        {
            return Items.OfType<SpaceItem>();
        }

        public IEnumerable<Item> GetChildItems(Guid id)
        {
            return Items.OfType<ChildItem>().Where(i => i.ParentId == id);
        }

        public IEnumerable<Item> Breadcrumb(Guid id)
        {
            var breadcrumb = new List<Item>();

            var item = Items.SingleOrDefault(i => i.Id == id);

            if(item != default)
            {
                breadcrumb.Add(item);

                while(item is ChildItem)
                {
                    var child = item as ChildItem;

                    item = Items.SingleOrDefault(i => i.Id == child.ParentId);

                    if(item != default)
                    {
                        breadcrumb.Add(item);
                    }
                }
            }

            breadcrumb.Reverse();

            return breadcrumb;
        }
    }
}
