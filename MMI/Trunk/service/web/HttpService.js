/** Provides support for HTTP requests at the web layer. 
 * At web layer, this service makes use of AJAX utility for making HTTP calls.
 * 
 */
appez.mmi.service.web.HttpService = appez.mmi.createClass({          
	className:"appez.mmi.service.web.HttpService",          //Contains Class Name
	singleton:true,                                    //specify whether the class is singleton object or not.By default service classes are singleton
	extend:appez.mmi.service.SmartEventService,             //Contains Base Class Name
	
	callbackFunction : null,
	callbackFunctionScope : null,
	smartEvent : null,
    
    /*
     * Name: processRequest
     * Description: Excecute SmartEventRequest object for native communication
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
		case appez.mmi.constant.WEB_HTTP_REQUEST:
			var reqData = this.parent.smEventRequest.getServiceRequestData();
			reqData = appez.mmi.util.Base64.decode(reqData);
			reqData = JSON.parse(reqData);
			var requestUrl = reqData[appez.mmi.constant.MMI_REQUEST_PROP_REQ_URL];
			var currentPageOrigin = window.location.origin;
			if(appez.getDeviceOs()==appezDevice.DEVICE_OS.WEB){
				this.executeHttpProxyRequest();
			} else {
				this.executeHttpRequest();
			}	
			break;
			
		case appez.mmi.constant.WEB_HTTP_REQUEST_SAVE_DATA:
			//TODO throw a ServiceNotSupportedException to the user
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
    * Name: executeHttpRequest
    * Description: Executes the HTTP request using AJAX, based on the DataRequest parameters provided in the 'SmartEventRequest' 
    * Returns: None
    * Details about if any exception is thrown.
    */
	executeHttpRequest : function(){
		appez.mmi.util.Ajax.performAjaxOperation(this.httpOperationSuccess,this.httpOperationError,this,this.parent.smEventRequest.getDataRequest());
	},

	/*
    * Name: executeHttpProxyRequest
    * Description: Executes the HTTP proxy request using AJAX, based on the DataRequest parameters provided in the 'SmartEventRequest' 
    * Returns: None
    * Details about if any exception is thrown.
    */
	executeHttpProxyRequest : function(){
		var me =this;
		var reqData = this.parent.smEventRequest.getServiceRequestData();
		reqData = appez.mmi.util.Base64.decode(reqData);
		reqData = JSON.parse(reqData);
		var httpRequest = JSON.stringify(reqData);
		
		appez.mmi.log("Sending request:"+httpRequest);	
		var requestUrl = null;
		if(reqData[appez.mmi.constant.MMI_REQUEST_PROP_REQ_SERVER_PROXY]!=undefined){
			requestUrl = reqData[appez.mmi.constant.MMI_REQUEST_PROP_REQ_SERVER_PROXY];
		} else {
			requestUrl = null;
		}
		var jqxhr = $.ajax({
			type: 'POST',
			url: requestUrl,
			data: "",
			beforeSend: function (request)
            {
				if(httpRequest!=null){
					request.setRequestHeader('requestData', httpRequest);
				}
            },
			async:false
		}).done(function(response, textStatus, jqXHR) {
			appez.mmi.log("AJAX success->Response:"+response+",Text status:"+textStatus);
			me.httpOperationSuccess(response, textStatus, jqXHR);			
		}).fail(function(jqXHR, textStatus, error) {
			appez.mmi.log("AJAX error->Error thrown:"+error+",text status:"+textStatus);
			me.httpOperationError(jqXHR, textStatus, error);			
		}).always(function() {
			appez.mmi.log("AJAX COMPLETE");
		});
	},
	
	/*
	 * Name: httpOperationSuccess
	 * Description: callback method that returns data to native.
	 * Returns: None
	 * Details about if any exception is thrown.
	 */
	httpOperationSuccess : function(response,textStatus,jqXHR){
		appez.mmi.log('HttpService->httpOperationSuccess->response:'+response);
		this.prepareResponse(true, JSON.parse(response), 0, null);
	},

	/*
	 * Name: httpOperationError
	 * Description: callback method that returns data to native.
	 * Returns: None
	 * Details about if any exception is thrown.
	 */
	httpOperationError : function(jqXHR,textStatus,error){
		appez.mmi.log('HttpService->httpOperationError');
		this.prepareResponse(false, null, appez.mmi.constant.HTTP_PROCESSING_EXCEPTION, error);		
	}
});	
