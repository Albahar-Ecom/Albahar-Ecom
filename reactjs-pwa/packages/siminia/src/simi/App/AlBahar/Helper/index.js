export const getChildProductSelected = (products, optionSelections) => {
    if (!products) return null

    const variant = products.find(item => {
        if (item.attributes && item.attributes.length && item.attributes.length > 0) {
            const { attributes } = item;
            let numberMatch = 0
            attributes.forEach((attribute) => {
                optionSelections.forEach(option => {
                    if (attribute.value_index === option) {
                        numberMatch += 1
                    }
                })

            })

            if (numberMatch === attributes.length) {
                return true
            }

            return false
        }

        return false
    })

    return variant
}