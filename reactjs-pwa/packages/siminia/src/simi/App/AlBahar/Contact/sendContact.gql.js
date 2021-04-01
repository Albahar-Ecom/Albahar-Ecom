import gql from 'graphql-tag';

export const SEND_CONTACT = gql`
    mutation sendContact($formData: ContactusInput!){
        contactusFormSubmit(
            input: $formData
        ){
            success_message
        }
    }
`;
