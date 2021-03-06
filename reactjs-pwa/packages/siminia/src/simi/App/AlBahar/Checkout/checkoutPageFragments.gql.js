import gql from 'graphql-tag';

export const CheckoutPageFragment = gql`
    fragment CheckoutPageFragment on Cart {
        id
        # If total quantity is falsy we render empty.
        total_quantity
        # Check virtual Cart
        is_virtual
        items {
            id
            product {
                id
                name
            }
            quantity
            prices {
                price {
                    currency
                    value
                }
                row_total {
                    value
                    currency
                }
                row_total_including_tax {
                    value
                    currency
                }
                discounts {
                    amount {
                        value
                        currency
                    }
                    label
                }
                total_item_discount {
                    value
                    currency
                }
            }
            ... on ConfigurableCartItem {
                configurable_options {
                    id
                    option_label
                    value_id
                    value_label
                }
            }
        }
    }
`;
