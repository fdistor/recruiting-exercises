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
    expect(typeof inventoryAllocator.isItemInWarehouse).to.equal("function");
    expect(
      typeof inventoryAllocator.getMinNumberOfItemInOrderAndWarehouse
    ).to.equal("function");
    expect(typeof inventoryAllocator.updateNumberOfItemInOrder).to.equal(
      "function"
    );
    expect(typeof inventoryAllocator.removeItemFromOrderIfAllFound).to.equal(
      "function"
    );
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
    expect(listOfItemsFound.list["owd"]).to.deep.equal({});
  });

  it("Should have methods", () => {
    expect(typeof listOfItemsFound.set).to.equal("function");
    expect(typeof listOfItemsFound.getItems).to.equal("function");
  });
});

describe("List Of Items Found functionality", () => {
  let listOfItemsFound;

  beforeEach(() => {
    const name = "owd";

    listOfItemsFound = new ListOfItemsFound(name);
  });

  it("Should set the correct key and value", () => {
    listOfItemsFound.set("apple", 5);

    const key = Object.keys(listOfItemsFound.list["owd"])[0];
    const value = Object.values(listOfItemsFound.list["owd"])[0];

    expect(key).to.equal("apple");
    expect(value).to.equal(5);
  });

  it("Should return the list of items found in warehouse", () => {
    listOfItemsFound.set("apple", 5);
    const list = listOfItemsFound.getItems();

    expect(list).to.deep.equal({ owd: { apple: 5 } });
  });
});

describe("Inventory Allocator searchWarehouses functionality", () => {
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

describe("Inventory Allocator helper functionality", () => {
  let inventoryAllocator;

  beforeEach(() => {
    const order = { apple: 1 };

    inventoryAllocator = new InventoryAllocator(warehouses, order);
  });

  it("Should return true if item is in warehouse", () => {
    const warehouse = inventoryAllocator.warehouses[0].inventory;

    expect(inventoryAllocator.isItemInWarehouse("apple", warehouse)).to.be.true;
  });

  it("Should return false if item is not in warehouse", () => {
    const warehouse = inventoryAllocator.warehouses[0].inventory;

    expect(inventoryAllocator.isItemInWarehouse("kiwi", warehouse)).to.be.false;
  });

  it("Should get the minimum number of items between the inventory and the order", () => {
    const warehouseApples = inventoryAllocator.warehouses[3].inventory.apple;

    expect(
      inventoryAllocator.getMinNumberOfItemInOrderAndWarehouse(
        inventoryAllocator.order.apple,
        warehouseApples
      )
    ).to.be.equal(1);
  });

  it("Should update the number of an item in the order if item is in warehouse", () => {
    const order = { orange: 7 };

    const warehouseOranges = inventoryAllocator.warehouses[3].inventory.orange;
    const minNumberOfOranges = inventoryAllocator.getMinNumberOfItemInOrderAndWarehouse(
      order.orange,
      warehouseOranges
    );

    inventoryAllocator.updateNumberOfItemInOrder(
      "orange",
      minNumberOfOranges,
      order
    );

    expect(order.orange).to.equal(2);
  });

  it("Should remove an item from the order if order quantity is found", () => {
    const order = { apple: 3 };

    const warehouseApples = inventoryAllocator.warehouses[3].inventory.apple;
    const minNumberOfApples = inventoryAllocator.getMinNumberOfItemInOrderAndWarehouse(
      order.apple,
      warehouseApples
    );

    inventoryAllocator.updateNumberOfItemInOrder(
      "apple",
      minNumberOfApples,
      order
    );

    inventoryAllocator.removeItemFromOrderIfAllFound("apple", order);

    expect(order.apple).to.not.exist;
  });
});
