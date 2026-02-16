"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOrderPrice = calculateOrderPrice;
const CLASICOS = [
    'Mojito',
    'Chilcano',
    'Laguna Azul',
    'Orgasmo',
    'Tinto de Verano',
    'Piña Colada',
    'Cuba Libre',
    'Machupicchu',
];
const DE_AUTOR = [
    'Margañaña',
    'Biffer Pink',
    'Tentacione Emiliani',
    'Gaviota',
    'Resina Sagrada',
    'Espíritu Antiguo',
];
const CERVEZAS = [
    'Pilsen',
];
const PRICES = {
    CLASICOS: {
        UNIT: 20,
        PROMO: 35,
    },
    DE_AUTOR: {
        UNIT: 25,
        PROMO: 40,
    },
    CERVEZAS: {
        UNIT: 10,
    }
};
function getItemCategory(name) {
    if (CLASICOS.includes(name))
        return 'CLASICOS';
    if (DE_AUTOR.includes(name))
        return 'DE_AUTOR';
    if (CERVEZAS.includes(name))
        return 'CERVEZAS';
    return null;
}
function calculateCategoryPrice(quantity, unitPrice, promoPrice) {
    if (!promoPrice) {
        return quantity * unitPrice;
    }
    const promoSets = Math.floor(quantity / 2);
    const remainingUnits = quantity % 2;
    return (promoSets * promoPrice) + (remainingUnits * unitPrice);
}
function calculateOrderPrice(items) {
    let clasicosTotal = 0;
    let deAutorTotal = 0;
    let cervezasTotal = 0;
    for (const item of items) {
        const category = getItemCategory(item.name);
        if (category === 'CLASICOS') {
            clasicosTotal += item.quantity;
        }
        else if (category === 'DE_AUTOR') {
            deAutorTotal += item.quantity;
        }
        else if (category === 'CERVEZAS') {
            cervezasTotal += item.quantity;
        }
    }
    const clasicosPrice = calculateCategoryPrice(clasicosTotal, PRICES.CLASICOS.UNIT, PRICES.CLASICOS.PROMO);
    const deAutorPrice = calculateCategoryPrice(deAutorTotal, PRICES.DE_AUTOR.UNIT, PRICES.DE_AUTOR.PROMO);
    const cervezasPrice = calculateCategoryPrice(cervezasTotal, PRICES.CERVEZAS.UNIT);
    return clasicosPrice + deAutorPrice + cervezasPrice;
}
//# sourceMappingURL=pricing.utils.js.map