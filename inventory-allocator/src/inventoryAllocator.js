class InventoryAllocator {
  constructor(warehouses, order) {
    this.order = { ...order };
    this.warehouses = warehouses.map(inventory => {
      return { ...inventory };
    });
  }

  searchWarehouses() {}
}

module.exports = InventoryAllocator;
