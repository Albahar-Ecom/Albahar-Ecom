import gql from 'graphql-tag';

export const SIGN_IN_SOCIAL_MUTATION = gql`
    mutation socialGenerateCustomerToken($email: String!, $id: String!) {
        socialGenerateCustomerToken(email: $email, id: $id) {
            token
    }
}
`;