/*Counter class recieve an array of product
and return an object with brand name as key
and time existed as value */

class Counter {
    constructor() {
        this.items = {};
    }
    add(key) {
        const key_cop = key.toLowerCase();
        if (this.items[key_cop] == undefined) this.items[key_cop] = 1;
        else this.items[key_cop] += 1;
    }
    create(data = [], Nobrand = []) {
        data.forEach((element) => {
            const brand = element.item_basic ?
                element.item_basic.brand.toLowerCase() :
                element.brandName.toLowerCase();
            if (brand && !Nobrand.includes(brand)) {
                this.add(brand);
            } else this.add("No Brand");
        });
    }
}

module.exports = Counter;