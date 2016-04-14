/** Provides support for the file read at the web layer. 
 * At web layer, this service makes use of AJAX call to fetch the contents of the file
 * 
 */
appez.mmi.service.web.FileService = appez.mmi.createClass({          
	className:"appez.mmi.service.web.FileService",    //Contains Class Name
	singleton:true,                                  //specify whether the class is singleton object or not ,By default service classes are singleton
	extend:appez.mmi.service.SmartEventService,           //Contains Base Class Name
	
	callbackFunction : null,
	callbackFunctionScope : null,
	smartEvent : null,
		
    /*
     * Name: processRequest
     * Description: Execute SmartEventRequest object for native communication
     * smartEventRequest: SmartEventRequest object
     * Returns: None , transfer control to callBack method.
     * Details about if any exception is thrown.
     */
	processRequest: function(smEvent, callbackFunc, callbackFuncScope){
		this.smartEvent = smEvent;
		this.callbackFunction = callbackFunc;
		this.callbackFunctionScope = callbackFuncScope;
		var smartEventRequest = smEvent.getSmartEventRequest();
		this.parent.smEventRequest = smEvent.getSmartEventRequest();
		switch(smartEventRequest.getServiceOperationId()){
		case appez.mmi.constant.WEB_READ_FILE_CONTENTS:
			this.readFileContents();
			break;
		}	
	},
	
	/*
	 * Prepares the modified SmartEvent model by adding the response to it
	 *  
	 */
	prepareResponse : function(isOperationComplete, serviceResponse, exceptionType, exceptionMessage){
		//TODO to set the response of this action in the SmartEventResponse object and return the controller using the 'processResponse' method
		var smartEventResponse = new appez.mmi.model.SmartEventResponse();
		smartEventResponse.setOperationComplete(isOperationComplete);
		smartEventResponse.setServiceResponse(serviceResponse);
		smartEventResponse.setExceptionType(exceptionType);
		smartEventResponse.setExceptionMessage(exceptionMessage);
		this.processResponse(smartEventResponse);
	},
   
	/*
	 * Name: processResponse
	 * Description: Here we get control after SmartEventRequest object processed.
	 * smartEventResponse: SmartEventResponse object
	 * Returns: None 
	 * Details about if any exception is thrown.
	 */
	processResponse: function(smartEventResponse){
		//Send the response directly to the calling scope and the specified callback function
		this.callbackFunction.call(this.callbackFunctionScope, smartEventResponse);
	},
	
	/*
     * Name: readFileContents
     * Description: method that reads the contents of the file using AJAX
     * Returns: None
     * Details about if any exception is thrown.
     */
	readFileContents : function(){
		var smEventRequest = this.parent.smEventRequest;
		var requestData = smEventRequest.getServiceRequestData();
		requestData = appez.mmi.util.Base64.decode(requestData);
    	var requestObj = JSON.parse(requestData);
    	
    	var request = {};
    	request['requestMethod'] = 'GET';
    	var fileName = requestObj['fileName'];
    	fileName = fileName.replace(/\//g, "\\");
    	request['requestUrl'] = fileName;
		appez.mmi.util.Ajax.performAjaxOperation(this.fileOperationSuccess,this.fileOperationError,this,request);
	},
	
	/*
	 * Name: fileOperationSuccess
	 * Description: callback method that returns data to native.
	 * Returns: None
	 * Details about if any exception is thrown.
	 */
	fileOperationSuccess : function(response,textStatus,jqXHR){
    	var fileContentEncode = appez.mmi.util.Base64.encode(response);
    	var smEventRequest = this.parent.smEventRequest;
		var requestData = smEventRequest.getServiceRequestData();
		requestData = appez.mmi.util.Base64.decode(requestData);
    	var requestObj = JSON.parse(requestData);
    	var fileName = requestObj['fileName'];
    	
    	var fileContentsArray = [];
    	var fileContent = {};
    	fileContent[appez.mmi.constant.MMI_RESPONSE_PROP_FILE_NAME] = fileName;
		fileContent[appez.mmi.constant.MMI_RESPONSE_PROP_FILE_CONTENT] = fileContentEncode;
		fileContent[appez.mmi.constant.MMI_RESPONSE_PROP_FILE_TYPE] = "";
		fileContent[appez.mmi.constant.MMI_RESPONSE_PROP_FILE_SIZE] = 0;
		fileContentsArray[0] = fileContent;
    	
		this.prepareResponse(true, fileContentsArray, 0, null);    	
	},

	/*
	 * Name: fileOperationError
	 * Description: callback method that returns data to native.
	 * Returns: None
	 * Details about if any exception is thrown.
	 */
	fileOperationError : function(jqXHR,textStatus,error){
		this.prepareResponse(false, null, appez.mmi.FILE_READ_EXCEPTION, null);
	}
});
