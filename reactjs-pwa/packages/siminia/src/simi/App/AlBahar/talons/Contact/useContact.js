import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { simiUseMutation as useMutation, simiUseQuery as useQuery } from 'src/simi/Network/Query';
import { sendRequest } from 'src/simi/Network/RestMagento';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';

export const useContact = (props) => {

    const {
        mutation
    } = props;

    const [isUploadFileLoading, setIsUploadFileLoading] = useState(false);
    const [base64file, setBase64file] = useState('');

    const [
        sendContactMutation,
        {
            data: message,
            error: sendError,
            called: sendCalled,
            loading: sendLoading
        }
    ] = useMutation(mutation);
    
    const sendContact = useCallback((formData) => {
        showFogLoading();
        sendContactMutation({
            variables: { formData }
        });
    }, [message, sendLoading, sendCalled]);

    useEffect(()=> {
        if (!sendLoading && (message || sendError)) {
            hideFogLoading();
        }
    }, [message, sendError, sendLoading]);

    const uploadFile = useCallback(async (postData) => {
        setBase64file(postData);
        // showFogLoading();
        // setIsUploadFileLoading(true);
        // sendRequest('/rest/V1/simiconnector/base64file', (result) => {
        //     setBase64file(result);
        //     setIsUploadFileLoading(false);
        //     hideFogLoading();
        // }, 'POST', {}, postData);
    });



    return {
        message,
        error: sendError,
        isLoading: sendLoading || isUploadFileLoading,
        sendContact,
        base64file,
        uploadFile
    }
}
