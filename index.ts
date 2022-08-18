/**
The task is to implement the Shop protocol (you can do that in this file directly).
- No database or any other storage is required, just store data in memory
- No any smart search, use String method contains (case sensitive/insensitive - does not matter)
–   Performance optimizations are optional
 */

interface Product {
  id: string;
  name: string;
  producer: string;
}

interface Shop {
  /**
    Adds a new product object to the Shop.
    - Parameter product: product to add to the Shop
    - Returns: false if the product with same id already exists in the Shop, true – otherwise.
   */
  addNewProduct: (product: Product) => boolean;

  /**
    Deletes the product with the specified id from the Shop.
    - Returns: true if the product with same id existed in the Shop, false – otherwise.
   */
  deleteProduct: (id: string) => boolean;

  /**
    - Returns: 10 product names containing the specified string. If there are several products with the same name, producer's name is appended to product's name.
   */
  listProductsByName: (searchString: string) => string[];

  /**
    - Returns: 10 product names whose producer contains the specified string, ordered by producers.
   */
  listProductsByProducer: (searchString: string) => string[];
}

class ShopImpl implements Shop {
  shop = new Map<string, Product>(); // Products list

  addNewProduct(product: Product): boolean {
    // TODO: your implementation goes here
    const hasSameProduct = this.shop.get(product.id);
    if (hasSameProduct === undefined) {
      this.shop.set(product.id, product);
      return true;
    }

    return false;
  }

  deleteProduct(id: string): boolean {
    // TODO: your implementation goes here
    return this.shop.delete(id);
  }

  listProductsByName(searchString: string): string[] {
    const shopCopyArr: Product[] = Array.from(this.shop.values());
    const list: Product[] = [];
    const productNames: string[] = [];
    const dubblicateProductNamesIdxs = new Set();

    for (let i = 0; i < this.shop.size && list.length < 10; i++) {
      const product = shopCopyArr[i];
      if (product?.name.includes(searchString)) {
        list.push(product);
        productNames.push(product.name);
      }
    }

    for (let i = 0; i < list.length; i++) {
      const dubblicateProductNameIdx = productNames.findIndex(
        (productName, idx) => {
          return productNames[i] === productName && i !== idx;
        }
      );

      if (dubblicateProductNameIdx >= 0) {
        dubblicateProductNamesIdxs.add(dubblicateProductNameIdx);
        dubblicateProductNamesIdxs.add(i);
      }
    }

    for (let i of dubblicateProductNamesIdxs) {
      if (typeof i === "number") {
        productNames[i] = `${list[i].producer} - ${list[i].name}`;
      }
    }

    return productNames;
  }

  listProductsByProducer(searchString: string): string[] {
    // TODO: your implementation goes here
    let sortedShop: Product[] = Array.from(this.shop.values());
    let newList: string[] = [];

    sortedShop.sort((prod1, prod2) => {
      if (prod1 && prod2) {
        return prod1.producer > prod2.producer ? 1 : -1;
      } else return -1;
    });

    sortedShop = sortedShop.filter((product) => {
      if (product && product.producer.includes(searchString)) {
        return product;
      } else return false;
    });

    sortedShop = sortedShop.slice(
      0,
      sortedShop.length > 10 ? 10 : sortedShop.length
    );

    sortedShop.forEach((product) => {
      if (product) {
        newList.push(product.name);
      }
    });

    return newList;
  }
}

function test(shop: Shop) {
  assert(!shop.deleteProduct("1"));
  assert(shop.addNewProduct({ id: "1", name: "1", producer: "Lex" }));
  assert(
    !shop.addNewProduct({
      id: "1",
      name: "any name because we check id only",
      producer: "any producer",
    })
  );
  assert(shop.deleteProduct("1"));
  assert(
    shop.addNewProduct({
      id: "3",
      name: "Some Product3",
      producer: "Some Producer2",
    })
  );
  assert(
    shop.addNewProduct({
      id: "4",
      name: "Some Product1",
      producer: "Some Producer3",
    })
  );
  assert(
    shop.addNewProduct({
      id: "2",
      name: "Some Product2",
      producer: "Some Producer2",
    })
  );
  assert(
    shop.addNewProduct({
      id: "1",
      name: "Some Product1",
      producer: "Some Producer1",
    })
  );
  assert(
    shop.addNewProduct({
      id: "5",
      name: "Other Product5",
      producer: "Other Producer4",
    })
  );
  assert(
    shop.addNewProduct({
      id: "6",
      name: "Other Product6",
      producer: "Other Producer4",
    })
  );
  assert(
    shop.addNewProduct({
      id: "7",
      name: "Other Product7",
      producer: "Other Producer4",
    })
  );
  assert(
    shop.addNewProduct({
      id: "8",
      name: "Other Product8",
      producer: "Other Producer4",
    })
  );
  assert(
    shop.addNewProduct({
      id: "9",
      name: "Other Product9",
      producer: "Other Producer4",
    })
  );
  assert(
    shop.addNewProduct({
      id: "10",
      name: "Other Product10",
      producer: "Other Producer4",
    })
  );
  assert(
    shop.addNewProduct({
      id: "11",
      name: "Other Product11",
      producer: "Other Producer4",
    })
  );

  var byNames: string[] = shop.listProductsByName("Product");
  assert(byNames.length == 10);

  byNames = shop.listProductsByName("Some Product");
  assert(byNames.length == 4);
  assert(byNames.indexOf("Some Producer3 - Some Product1") >= 0);
  assert(byNames.indexOf("Some Product2") >= 0);
  assert(byNames.indexOf("Some Product3") >= 0);
  assert(byNames.indexOf("Some Product1") < 0);
  assert(byNames.indexOf("Some Producer1 - Some Product1") >= 0);

  var byProducer: string[] = shop.listProductsByProducer("Producer");
  assert(byProducer.length == 10);

  byProducer = shop.listProductsByProducer("Some Producer");
  assert(byProducer.length == 4);
  assert(byProducer[0] == "Some Product1");
  assert(byProducer[1] == "Some Product2" || byProducer[1] == "Some Product3");
  assert(byProducer[2] == "Some Product2" || byProducer[2] == "Some Product3");
  assert(byProducer[3] == "Some Product1");
}

function assert(condition: boolean) {
  if (!condition) {
    throw new Error("Assertion failed");
  }
}

test(new ShopImpl());
