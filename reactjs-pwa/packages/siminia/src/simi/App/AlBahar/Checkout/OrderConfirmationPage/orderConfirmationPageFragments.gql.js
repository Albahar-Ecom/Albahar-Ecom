import gql from 'graphql-tag';
import { ItemsReviewFragment } from '../ItemsReview/itemsReviewFragments.gql';

export const OrderConfirmationPageFragment = gql`
    fragment OrderConfirmationPageFragment on Cart {
        id
        email
        total_quantity
        prices {
            grand_total {
                value
                currency
            }
            discounts {
                label
                amount {
                    value
                }
            }
            subtotal_excluding_tax {
                value
            }
            applied_taxes {
                label
                amount {
                    value
                }
            }
        }
        shipping_addresses {
            firstname
            lastname
            street
            city
            region {
                label
            }
            postcode
            country {
                label
            }

            selected_shipping_method {
                carrier_title
                method_title
            }
        }
        ...ItemsReviewFragment
    }
    ${ItemsReviewFragment}
`;
