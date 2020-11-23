using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using Vouzamo.UXC.App.Models;

namespace Vouzamo.UXC.Tests
{
    [TestClass]
    public class UnitTest1
    {
        private ItemHierarchy Items { get; }

        public UnitTest1()
        {
            Items = new ItemHierarchy();
        }

        [TestMethod]
        public void BreadcrumbTests()
        {
            var spaces = Items.GetSpaces();
            var items = Items.GetChildItems(spaces.First().Id);
            var contentFolder = items.First();
            var contentFolderItems = Items.GetChildItems(contentFolder.Id);
            var contractItem = contentFolderItems.First();

            var breadcrumb = Items.Breadcrumb(contractItem.Id);

            Assert.AreEqual(3, breadcrumb.Count());
        }
    }
}
