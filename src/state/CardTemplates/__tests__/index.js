import "babel-polyfill";
import CardTemplates from '../'

const FindErrors = (errorType, condition) => {
    expect(Object.entries(CardTemplates)
        .filter(([key]) => ( key !== 'Types' ))
        .some(([key, value]) => {
            try {
                if (condition(key, value)) {
                    console.log(`${errorType} error in element: ${key}`)
                    return true
                }
                else {
                    return false
                }
            }
            catch (e) {
                console.log(`Exception error ${e} in element: ${key}`)
                return true
            }
        })
    ).toBe(false)
}

describe('store/state/CardTemplates', () => {
    it('should map all IDs to objects with a similar ID property', () => {
        expect(Object.entries(CardTemplates)
            .some(([key, value]) => {
                    if (key !== 'Types' && value.id !== key) {
                        console.log(`Mismatch in element: ${key}`)
                        return true
                    }
                    else {
                        return false
                    }
            }))
        .toBe(false)
    })

    it('should only allow permitted styles', () => {
        FindErrors('Style', (key, value) => (!['science', 'control', 'plain'].find(val => (value.style === val))))
    })

    it('should only allow aggregates of legitimate templates', () => {
        FindErrors('Aggregate', (key, value) => (value.aggregates && value.aggregates.some(aggregate => (
            (Array.isArray(aggregate.cardTemplates) &&  
                aggregate.cardTemplates.some(val => !CardTemplates[val] )) ||
            (!Array.isArray(aggregate.cardTemplates) &&
                !CardTemplates[aggregate.cardTemplates])
        ))))
    })

    it('should only allow purchase prices of aggregated types', () => {
        FindErrors('Price', (key, value) => (value.purchases && value.purchases.some(purchase => {
            const priceArray = Array.isArray(purchase.price) 
                ? purchase.price.map(price => price.cardTemplate)
                : [purchase.price.cardTemplate]
            return priceArray.some(price => !value.aggregates.some(aggregate => {
                const aggregateArray = Array.isArray(aggregate.cardTemplates) 
                    ? aggregate.cardTemplates 
                    : [aggregate.cardTemplates]
                return aggregateArray.some(aggregateCard => aggregateCard === price)
            }))
        })))
    })    

    it('should only allow purchase of legitimate templates', () => {
        FindErrors('Price', (key, value) => (value.purchases && value.purchases.some(purchase => (
            !CardTemplates[purchase.cardTemplate]
        ))))
    })

    it('should only allow upgrades from legitimate templates', () => {
        FindErrors('Upgrade', (key, value) => (value.upgrade && Object.entries(value.upgrade).some(([upgradeKey]) => ( !CardTemplates[upgradeKey]))))
    })

    it('should only allow upgrades to legitimate templates', () => {
        FindErrors('Upgrade', (key, value) => (value.upgrade && Object.values(value.upgrade).some((upgradeValue) => ( !CardTemplates[upgradeValue]))))
    })

})