const ListOfItemsFound = require("./ListOfItemsFound.js");

class InventoryAllocator {
  constructor(warehouses, order) {
    this.order = { ...order };
    this.warehouses = warehouses.map(inventory => {
      return { ...inventory };
    });
  }

  isItemInWarehouse(item, warehouse) {
    return typeof warehouse[item] === "number";
  }

  getMinNumberOfItemInOrderAndWarehouse(
    numberOfItemsInOrder,
    numberOfItemsInWareHouse
  ) {
    return Math.min(numberOfItemsInOrder, numberOfItemsInWareHouse);
  }

  updateNumberOfItemInOrder(item, amountFoundInWarehouse, order) {
    order[item] = order[item] - amountFoundInWarehouse;
  }

  removeItemFromOrderIfAllFound(item, order) {
    if (order[item] === 0) {
      delete order[item];
    }
  }

  doesContainItems(object) {
    return Object.keys(object).length !== 0;
  }

  searchWarehouses() {
    const copyOfOrder = { ...this.order };
    let results = [];

    this.warehouses.forEach(warehouse => {
      const { name, inventory } = warehouse;
      const listOfItemsFoundInWarehouse = new ListOfItemsFound(name);

      for (let item in copyOfOrder) {
        if (this.isItemInWarehouse(item, inventory)) {
          const minNumberOfItem = this.getMinNumberOfItemInOrderAndWarehouse(
            copyOfOrder[item],
            inventory[item]
          );

          listOfItemsFoundInWarehouse.set(item, minNumberOfItem);
          this.updateNumberOfItemInOrder(item, minNumberOfItem, copyOfOrder);
          this.removeItemFromOrderIfAllFound(item, copyOfOrder);
        }
      }

      if (this.doesContainItems(listOfItemsFoundInWarehouse.getItems())) {
        results.push(listOfItemsFoundInWarehouse.list);
      }
    });

    return this.doesContainItems(copyOfOrder) ? [] : results;
  }
}

module.exports = InventoryAllocator;
