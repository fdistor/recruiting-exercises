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

          if (copyOfOrder[item] === 0) {
            delete copyOfOrder[item];
          }
        }
      }

      const numberOfItemsInList = Object.keys(
        listOfItemsFoundInWarehouse.list[name]
      ).length;

      if (numberOfItemsInList > 0) {
        results.push(listOfItemsFoundInWarehouse.getItems());
      }
    });

    const isOrderComplete = Object.keys(copyOfOrder).length === 0;

    return isOrderComplete ? results : [];
  }
}

module.exports = InventoryAllocator;
