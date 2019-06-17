const { expect } = require("chai");
const warehouses = require("../data/data.js");
const InventoryAllocator = require("../src/inventoryAllocator.js");
const ListOfItemsFound = require("../src/ListOfItemsFound.js");

describe("Inventory Allocator class", () => {
  let inventoryAllocator;

  beforeEach(() => {
    const inventory = [];
    const order = {};
    inventoryAllocator = new InventoryAllocator(inventory, order);
  });

  it("Should exist", () => {
    expect(inventoryAllocator).to.exist;
  });

  it("Should initialize properties", () => {
    expect(inventoryAllocator.warehouses).to.deep.equal([]);
    expect(inventoryAllocator.order).to.deep.equal({});
  });

  it("Should not mutate properties if inputs change", () => {
    const order = { apple: 1 };
    const warehouses = [{ name: "owd", inventory: { apple: 1 } }];
    inventoryAllocator = new InventoryAllocator(warehouses, order);

    order.apple = 10;
    warehouses[0].name = "dm";

    expect(inventoryAllocator.order).to.deep.equal({ apple: 1 });
    expect(inventoryAllocator.warehouses).to.deep.equal([
      { name: "owd", inventory: { apple: 1 } }
    ]);
  });

  it("Should have methods", () => {
    expect(typeof inventoryAllocator.searchWarehouses).to.equal("function");
  });
});

describe("List Of Items Found class", () => {
  let listOfItemsFound;

  beforeEach(() => {
    const name = "owd";

    listOfItemsFound = new ListOfItemsFound(name);
  });

  it("Should exist", () => {
    expect(listOfItemsFound).to.exist;
  });

  it("Should initialize properties", () => {
    expect(typeof listOfItemsFound.list).to.equal("object");
    expect(listOfItemsFound.list.name).to.deep.equal({});
  });

  it("Should have methods", () => {
    expect(typeof listOfItemsFound.set).to.equal("function");
    expect(listOfItemsFound.getItems).to.equal("function");
  });
});

describe("Inventory Allocator functionality", () => {
  let inventoryAllocator;

  beforeEach(() => {
    const order = {};

    inventoryAllocator = new InventoryAllocator(warehouses, order);
  });

  it("Should handle an empty order", () => {
    expect(inventoryAllocator.searchWarehouses()).to.deep.equal([]);
  });

  it("Should handle an empty warehouse list", () => {
    inventoryAllocator.warehouses = [];

    expect(inventoryAllocator.searchWarehouses()).to.deep.equal([]);
  });

  it("Should return no warehouses if items do not exist", () => {
    inventoryAllocator.order = { pear: 1, strawberry: 1 };

    expect(inventoryAllocator.searchWarehouses()).to.deep.equal([]);
  });

  it("Should retrieve from one warehouse if all items are found", () => {
    inventoryAllocator.order = { banana: 1 };

    expect(inventoryAllocator.searchWarehouses()).to.deep.equal([
      { pol: { banana: 1 } }
    ]);
  });

  it("Should retrieve from the first warehouse if all items are found", () => {
    inventoryAllocator.order = { apple: 1 };

    expect(inventoryAllocator.searchWarehouses()).to.deep.equal([
      { owd: { apple: 1 } }
    ]);
  });

  it("Should retrieve from multiple warehouses if all items found", () => {
    inventoryAllocator.order = { apple: 2, banana: 1, orange: 5 };

    expect(inventoryAllocator.searchWarehouses()).to.deep.equal([
      { owd: { apple: 1 } },
      { dmk: { apple: 1 } },
      { pol: { banana: 1 } },
      { ida: { orange: 5 } }
    ]);
  });

  it("Should return no warehouses if insufficient inventory", () => {
    inventoryAllocator.order = { orange: 6 };

    expect(inventoryAllocator.searchWarehouses()).to.deep.equal([]);
  });

  it("Should return no warehouses if not all items are found", () => {
    inventoryAllocator.order = { apple: 1, banana: 1, orange: 6 };

    expect(inventoryAllocator.searchWarehouses()).to.deep.equal([]);
  });

  it("Should not mutate order after searching warehouses", () => {
    inventoryAllocator.order = { apple: 1 };

    inventoryAllocator.searchWarehouses();

    expect(inventoryAllocator.order).to.deep.equal({ apple: 1 });
  });
});
