const { expect } = require("chai");
const warehouses = require("../data/data.js");
const InventoryAllocator = require("../src/inventoryAllocator.js");

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

describe("Inventory Allocator functionality", () => {});
