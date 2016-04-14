/** 
 * 
 *	Utility class for performing Ajax class.
 * 
 **/

appez.smartweb.util.Ajax= appez.smartweb.createClass({
	className : "appez.smartweb.util.Ajax",
	singleton : true,

	callbackFunction : null,
	callbackErrorFunction : null,
	callbackFunctionScope : null,
	callingService : null,
	
	/**
	  *  Name: performAjaxOperation
	  *  Description: Performs the ajax request on behalf of client and calls appropriate call back function
	  *  Returns: None , transfer control to callBack method.	  * 
	  *  @param: 
	  *        callbackFunc: function to call when ajax call completed successfully 
	  *        callbackErrorFunc: function to call when ajax call fails 
	  *        callbackFuncScope: scope in which the function should be executed 
	  *        requestObj: type of the request of call
	  *          
	  */
	performAjaxOperation : function(callbackFunc,callbackErrorFunc, callbackFuncScope, requestObj,shouldRunLocal){
		this.callbackFunction = callbackFunc;
		this.callbackErrorFunction = callbackErrorFunc;
		this.callbackFunctionScope = callbackFuncScope;
		var me=this;
		
		//Set the default value of request type
		var requestType = 'GET';
		if(requestObj['requestMethod']!=undefined && requestObj['requestMethod']!=null){
			requestType = requestObj['requestMethod'];
		}
		
		//Initialize the URL based on the user input
		var requestUrl = "";
		if(requestObj['requestUrl']!=undefined && requestObj['requestUrl']!=null){
			requestUrl = requestObj['requestUrl'];
		}
		
		//Initialize the post body based on the user input
		var requestBody = "";
		if(requestObj['requestPostBody']!=undefined && requestObj['requestPostBody']!=null){
			requestBody = requestObj['requestPostBody'];
		}
		
		var headerKeyValue = null;
		if(requestObj['requestHeaderInfo']!=undefined && requestObj['requestHeaderInfo']!=null){
			headerKeyValue = this.initHeaderKeyValuePair(requestObj['requestHeaderInfo']);
		}
		
		var reqContentType = "application/x-www-form-urlencoded; charset=UTF-8";
		if(requestObj['requestContentType']!=undefined && requestObj['requestContentType']!=null){
			reqContentType=requestObj['requestContentType'];
		}
		var jqxhr;
		if(shouldRunLocal){
			jqxhr = $.ajax({
			type: requestType,
			url: requestUrl,
                	isLocal: true,
			data: requestBody,
			contentType : reqContentType,
			beforeSend: function (request)
		            {
						if(headerKeyValue!=null){
							for(var key in headerKeyValue){
								console.log('AJAX.js->performAjaxOperation-> header key:'+key+",header value:"+headerKeyValue[key]);
				                request.setRequestHeader(key, headerKeyValue[key]);
							}
						}
		            },
			async:false
		});
		} else {
		jqxhr = $.ajax({
			type: requestType,
			url: requestUrl,
			data: requestBody,
			contentType : reqContentType,
			beforeSend: function (request)
		            {
						if(headerKeyValue!=null){
							for(var key in headerKeyValue){
								console.log('AJAX.js->performAjaxOperation-> header key:'+key+",header value:"+headerKeyValue[key]);
				                request.setRequestHeader(key, headerKeyValue[key]);
							}
						}
		            },
			async:false
		});
	}
	jqxhr.done(function(response, textStatus, jqXHR) {
			//console.log("AJAX success->Response:"+response+",Text status:"+textStatus);
			// means operation has completed successfully
			me.callbackFunction.call(callbackFuncScope,response,textStatus,jqXHR);
		}).fail(function(jqXHR, textStatus, error) {
			console.log("AJAX error->Error thrown:"+error+",text status:"+textStatus);
			
			me.callbackErrorFunction.call(callbackFuncScope,jqXHR,textStatus,error);
		}).always(function() {
			console.log("AJAX COMPLETE");
		});
	},
	
	 /**
	  *  Name: initHeaderKeyValuePair
      *  Description: Extracts the key value pair from header details  
      *  Returns: Collection of key value pair present in header detail	   
	  *  @param: 
	  *         headerKeyValueInfo: header information detail 	
	  *          
	  */
	
	initHeaderKeyValuePair : function(headerKeyValueInfo){
		var headerKeyValueCollection = {};
		var headers = [headerKeyValueInfo];
		if(headerKeyValueInfo.indexOf(eMob.constant.HTTP_HEADER_SEPARATOR)>-1){
			headers = headerKeyValueInfo.split(eMob.constant.HTTP_HEADER_SEPARATOR);
		}
		var totalHeaders = headers.length;
		for(var currentHeader=0;currentHeader<totalHeaders;currentHeader++){
			var headerKeyValue = headers[currentHeader].split(eMob.constant.HTTP_HEADER_VALUE_SEPARATOR);
			headerKeyValueCollection[headerKeyValue[0]] = headerKeyValue[1];
		}
		
		return headerKeyValueCollection;
	}

});