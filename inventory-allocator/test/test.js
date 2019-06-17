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

  it("Should have methods", () => {
    expect(typeof inventoryAllocator.searchWarehouses).to.equal("function");
  });
});
