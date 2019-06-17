const ListOfItemsFound = require("./ListOfItemsFound.js");

class InventoryAllocator {
  constructor(warehouses, order) {
    this.order = { ...order };
    this.warehouses = warehouses.map(inventory => {
      return { ...inventory };
    });
  }

  searchWarehouses() {
    const copyOfOrder = { ...this.order };
    let results = [];

    this.warehouses.forEach(warehouse => {
      const { name, inventory } = warehouse;
      const listOfItemsFound = new ListOfItemsFound(name);

      for (let item in copyOfOrder) {
        if (inventory[item]) {
          const numberOfItemsFoundInInventory = Math.min(
            this.order[item],
            inventory[item]
          );

          listOfItemsFound.set(item, numberOfItemsFoundInInventory);
          copyOfOrder[item] = copyOfOrder[item] - numberOfItemsFoundInInventory;

          if (copyOfOrder[item] === 0) {
            delete copyOfOrder[item];
          }
        }
      }

      const numberOfItemsInList = Object.keys(listOfItemsFound.list[name])
        .length;

      if (numberOfItemsInList > 0) {
        results.push(listOfItemsFound.getItems());
      }
    });

    const isOrderComplete = Object.keys(copyOfOrder).length === 0;

    return isOrderComplete ? results : [];
  }
}

module.exports = InventoryAllocator;
