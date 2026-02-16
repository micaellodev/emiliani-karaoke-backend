// Pricing utility for calculating order totals with promotion logic

// Cocktail categories
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

// Pricing constants
const PRICES = {
    CLASICOS: {
        UNIT: 20,
        PROMO: 35, // 2x35
    },
    DE_AUTOR: {
        UNIT: 25,
        PROMO: 40, // 2x40 (updated from 50 based on carta page)
    },
    CERVEZAS: {
        UNIT: 10,
    }
};

/**
 * Determines the category of a cocktail or drink
 */
function getItemCategory(name: string): 'CLASICOS' | 'DE_AUTOR' | 'CERVEZAS' | null {
    if (CLASICOS.includes(name)) return 'CLASICOS';
    if (DE_AUTOR.includes(name)) return 'DE_AUTOR';
    if (CERVEZAS.includes(name)) return 'CERVEZAS';
    return null;
}

/**
 * Calculates the price for a specific quantity of cocktails
 * Applies promotion logic: every 2 units = promo price, remaining units at unit price
 */
function calculateCategoryPrice(quantity: number, unitPrice: number, promoPrice?: number): number {
    if (!promoPrice) {
        return quantity * unitPrice;
    }
    const promoSets = Math.floor(quantity / 2);
    const remainingUnits = quantity % 2;

    return (promoSets * promoPrice) + (remainingUnits * unitPrice);
}

/**
 * Calculates the total price for an order
 * @param items Array of { name: string, quantity: number }
 * @returns Total price in soles
 */
export function calculateOrderPrice(items: Array<{ name: string; quantity: number }>): number {
    let clasicosTotal = 0;
    let deAutorTotal = 0;
    let cervezasTotal = 0;

    for (const item of items) {
        const category = getItemCategory(item.name);

        if (category === 'CLASICOS') {
            clasicosTotal += item.quantity;
        } else if (category === 'DE_AUTOR') {
            deAutorTotal += item.quantity;
        } else if (category === 'CERVEZAS') {
            cervezasTotal += item.quantity;
        }
        // Items not in known categories are ignored
    }

    const clasicosPrice = calculateCategoryPrice(
        clasicosTotal,
        PRICES.CLASICOS.UNIT,
        PRICES.CLASICOS.PROMO
    );

    const deAutorPrice = calculateCategoryPrice(
        deAutorTotal,
        PRICES.DE_AUTOR.UNIT,
        PRICES.DE_AUTOR.PROMO
    );

    const cervezasPrice = calculateCategoryPrice(
        cervezasTotal,
        PRICES.CERVEZAS.UNIT
    );

    return clasicosPrice + deAutorPrice + cervezasPrice;
}
