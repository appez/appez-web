appez.mmi.util.FrameworkUtil = appez.mmi.createClass({
	className:"appez.mmi.util.FrameworkUtil", //Contains The Class Name.
    singleton:true,   
    
    /**
     * Prepares a request in a JSON structure that is acceptable to the native layer
     * 
     * */
    prepareRequestObjForNative : function(smEvent){
    	var requestObj = {};
    	
    	requestObj[appez.mmi.constant.MMI_MESSAGE_PROP_TRANSACTION_ID] = smEvent.getTransactionId();
    	requestObj[appez.mmi.constant.MMI_MESSAGE_PROP_RESPONSE_EXPECTED] = smEvent.getResponseExpected();
    	requestObj[appez.mmi.constant.MMI_MESSAGE_PROP_TRANSACTION_REQUEST] = {};
    	requestObj[appez.mmi.constant.MMI_MESSAGE_PROP_TRANSACTION_REQUEST][appez.mmi.constant.MMI_MESSAGE_PROP_REQUEST_OPERATION_ID] = smEvent.getSmartEventRequest().getServiceOperationId();
    	requestObj[appez.mmi.constant.MMI_MESSAGE_PROP_TRANSACTION_REQUEST][appez.mmi.constant.MMI_MESSAGE_PROP_REQUEST_DATA] = smEvent.getSmartEventRequest().getServiceRequestData();
    	requestObj[appez.mmi.constant.MMI_MESSAGE_PROP_TRANSACTION_RESPONSE] = {};
    	
    	return requestObj;
    },
    
    prepareSmartEvent : function(requestData, isResponseExpected, serviceOperationId){
    	var smartEvent = new appez.mmi.model.SmartEvent();
    	smartEvent.setTransactionId(new Date().getTime());
    	smartEvent.setResponseExpected(isResponseExpected);
    	
    	var smEventRequest = new appez.mmi.model.SmartEventRequest();
    	smEventRequest.setServiceOperationId(serviceOperationId);
    	requestData = JSON.stringify(requestData);
    	var encodedRequestData = appez.mmi.base64Encode(requestData);
    	smEventRequest.setServiceRequestData(encodedRequestData);
    	
    	smartEvent.setSmartEventRequest(smEventRequest);
    	
    	return smartEvent;
    },
    
    getSmartEventResponseForServiceError : function(exceptionType,exceptionMessage){
    	var smEventResponse = new appez.mmi.model.SmartEventResponse();
    	smEventResponse.setOperationComplete(false);
    	smEventResponse.setServiceResponse(null);
    	smEventResponse.setExceptionType(exceptionType);
    	smEventResponse.setExceptionMessage(exceptionMessage);
    	return smEventResponse;
    },
    
    eventReqHasRequiredFields : function(requestObj, requiredFields){
    	var hasAllRequiredFields = false;
    	if(requestObj!=null && requestObj!=undefined){
    		if((requiredFields instanceof Array)&&(requiredFields.length>0)){
    			var requiredFieldsCount = requiredFields.length;
    			for(var currentField=0;currentField<requiredFieldsCount;currentField++){
    				if(requestObj[requiredFields[currentField]]!=undefined){
    					hasAllRequiredFields = true;
    				} else {
    					hasAllRequiredFields = false;
    					break;
    				}
    			}
    		}
    	}
    	return hasAllRequiredFields;
    },
    
    getRequestObjFromSmartEvent : function(smartEvent){
    	var smEventRequest = smartEvent.getSmartEventRequest(); 
    	var requestObj = smEventRequest.getServiceRequestData();
    	
    	if(requestObj!=null && requestObj.length>0){
    		requestObj = appez.mmi.base64Decode(requestObj);
    		requestObj = JSON.parse(requestObj);
    	} else {
    		requestObj = {};
    	}
    	return requestObj;
    },
    
    prepareRequestHeaderString : function(headerKeys, headerValues){
    	var allHeadersArray = [];
    	if((headerKeys!=undefined && headerKeys!=null)&&(headerValues!=undefined && headerValues!=null)){
    		if(headerKeys.length>0 && headerValues.length>0){
    			var allHeadersCount = headerKeys.length;
    			for(var currentHeaderIndex=0;currentHeaderIndex<allHeadersCount;currentHeaderIndex++){
    				var currentHeader = {};
    				currentHeader[appez.mmi.constant.MMI_REQUEST_PROP_HTTP_HEADER_KEY] = headerKeys[currentHeaderIndex];
    				currentHeader[appez.mmi.constant.MMI_REQUEST_PROP_HTTP_HEADER_VALUE] = headerValues[currentHeaderIndex];
    				allHeadersArray.push(currentHeader);
    			}
    		}
    	}
    	return JSON.stringify(allHeadersArray);
    },
    
    handleNotifierRequestError : function(errorType, errorMessage){
    	appez.mmi.log(errorMessage, appez.mmi.constant.LOG_LEVEL_ERROR);
    },
    
    prepareNotifierObjForNative : function(notifierEvent){
    	var requestObj = {};
    	
    	requestObj[appez.mmi.constant.NOTIFIER_PROP_TRANSACTION_ID] = notifierEvent.getTransactionId();
    	requestObj[appez.mmi.constant.NOTIFIER_PROP_TRANSACTION_REQUEST] = {};
    	requestObj[appez.mmi.constant.NOTIFIER_PROP_TRANSACTION_REQUEST][appez.mmi.constant.NOTIFIER_TYPE] = notifierEvent.getNotifierEventRequest().getType();
    	requestObj[appez.mmi.constant.NOTIFIER_PROP_TRANSACTION_REQUEST][appez.mmi.constant.NOTIFIER_ACTION_TYPE] = notifierEvent.getNotifierEventRequest().getActionType();
    	requestObj[appez.mmi.constant.NOTIFIER_PROP_TRANSACTION_REQUEST][appez.mmi.constant.NOTIFIER_REQUEST_DATA] = notifierEvent.getNotifierEventRequest().getData();
    	requestObj[appez.mmi.constant.NOTIFIER_PROP_TRANSACTION_RESPONSE] = {};
    	
    	return requestObj;
    },
    
    prepareNotifierEvent : function(eventData, notifierType, notifierActionType){
    	var notifierEvent = new appez.mmi.model.NotifierEvent();
    	notifierEvent.setTransactionId(new Date().getTime());
    	
    	var notifierEventRequest = new appez.mmi.model.NotifierEventRequest();
    	notifierEventRequest.setType(notifierType);
    	notifierEventRequest.setActionType(notifierActionType);
    	eventData = JSON.stringify(eventData);
    	var encodedRequestData = appez.mmi.base64Encode(eventData);
    	notifierEventRequest.setData(encodedRequestData);
    	
    	notifierEvent.setNotifierEventRequest(notifierEventRequest);
    	
    	return notifierEvent;
    },
    
    getRequestObjFromNotifierEvent : function(notifierEvent){ 
    	var requestObj = null;
    	try {
        	var notifierEventRequest = notifierEvent.getNotifierEventRequest();
        	requestObj = notifierEventRequest.getData();
        	if(requestObj!=null && requestObj.length>0){
        		requestObj = appez.mmi.base64Decode(requestObj);
        		requestObj = JSON.parse(requestObj);
        	} else {
        		requestObj = {};
        	}
    	} catch(err) {
    		requestObj = {};
    	}
    	
    	return requestObj;
    }
});