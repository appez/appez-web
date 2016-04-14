//TODO refactor this class contents in accordance with new structure

/** Provides support for the database service at the web layer. 
 * At web layer, this service makes use of webDB as a SQLite client. By default, Chrome and Safari have support for it
 * 
 */
appez.mmi.service.web.DatabaseService = appez.mmi.createClass({          
	className:"appez.mmi.service.web.DatabaseService", //Contains Class Name
	singleton:true,                               //specify whether the class is singleton object or not ,By default service classes are singleton
	extend:appez.mmi.service.SmartEventService,        //Contains Base Class Name
	dbInstance : null,							  //Instance of the webDB with the user specified properties
                        
    webServiceDbSize : 5 * 1024 * 1024, 		  // represents the default size of the WebDB allotted to the application. Default value is 5MB       
    
    applicationVar : null,
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
		case appez.mmi.constant.WEB_OPEN_DATABASE:
			this.openDb(smartEventRequest);
			break;
			
		case appez.mmi.constant.WEB_EXECUTE_DB_QUERY:
			this.fireQuery(smartEventRequest);
			break;	
			
		case appez.mmi.constant.WEB_EXECUTE_DB_READ_QUERY:
			this.fireReadQuery(smartEventRequest);
			break;	
		}
	},
	
	initDb : function(applicationObj){
		this.applicationVar = applicationObj;
	},
	
	openDb : function(smEventRequest){
		//Get the application variable for initialising the 'webdb' variable.
		//TODO find out the way for getting the application variable
//		this.applicationVar = appez.smartweb.getApplication();
		var requestData = smEventRequest.getServiceRequestData();
		requestData = appez.mmi.util.Base64.decode(requestData);
    	var requestObj = JSON.parse(requestData);
		try {
			if((this.applicationVar!=null)&&(this.applicationVar!=undefined)){
				this.applicationVar.webdb = {};
				//if the user has provided the size of the database, then create the database with that size, else take the default value as 5 MB
				if((this.applicationVar.config.webDbSize!=undefined)&&(this.applicationVar.config.webDbSize!=null)){
					this.webServiceDbSize = this.applicationVar.config.webDbSize; 
				}
				this.applicationVar.webdb.db = openDatabase(""+requestObj[appez.mmi.constant.MMI_REQUEST_PROP_APP_DB], "1.0", this.applicationVar.appName+"Database Description", this.webServiceDbSize);
				this.dbInstance = this.applicationVar.webdb.db;
				if((this.dbInstance!=null)&&(this.dbInstance!=undefined)){
					this.queryCallback(null,this.dbInstance);
				} else {
					this.prepareResponse(false, null, appez.mmi.constant.DB_OPERATION_ERROR, appez.mmi.constant.DB_OPERATION_ERROR_MESSAGE);
				}
			} else {
				//Means the user has not specified configuration specifications. In this case, go ahead with the default settings
				this.applicationVar = {};
				this.applicationVar.webdb = {};
				this.applicationVar.webdb.db = openDatabase(""+requestObj[appez.mmi.constant.MMI_REQUEST_PROP_APP_DB], "1.0", appez.mmi.constant.DEFAULT_APP_NAME+"Database Description", this.webServiceDbSize);
				this.dbInstance = this.applicationVar.webdb.db;
				if((this.dbInstance!=null)&&(this.dbInstance!=undefined)){
					this.queryCallback(null,this.dbInstance);
				} else {
					this.prepareResponse(false, null, appez.mmi.constant.DB_OPERATION_ERROR, appez.mmi.constant.DB_OPERATION_ERROR_MESSAGE);
				}
			}
		} catch(error) {
			this.prepareResponse(false, null, appez.mmi.constant.DB_OPERATION_ERROR, error.message);
		}
	},
	 
	closeDb : function(smEventRequest){
		//TODO find out how to close database in webdb
	},
	
	fireQuery : function(smEventRequest){
		var me = this;
		var sqlQuery = null;
		var reqData = this.parent.smEventRequest.getServiceRequestData();
		reqData = appez.mmi.util.Base64.decode(reqData);
		reqData = JSON.parse(reqData);
		sqlQuery = reqData[appez.mmi.constant.MMI_REQUEST_PROP_QUERY_REQUEST];
		this.dbInstance.transaction(function(tx) {
			appez.mmi.log("inside fire query");
			tx.executeSql(sqlQuery, [], 
							function (tx, results) {
								appez.mmi.log("Query successfully executed:");
								me.queryCallback(tx, results);
							}, 
							function (tx, results) {
								appez.mmi.log("Error executing query:");
								me.prepareResponse(false, null, appez.mmi.constant.DB_OPERATION_ERROR, results);
							});
			});
	},
	
	queryCallback : function(tx, r){
		appez.mmi.log("Database Service->queryCallback");
		var dbResponseSuccessObj = {};
		var smEventRequest = this.parent.smEventRequest;
		var requestData = smEventRequest.getServiceRequestData();
		requestData = appez.mmi.util.Base64.decode(requestData);
    	var requestObj = JSON.parse(requestData);
		dbResponseSuccessObj[appez.mmi.constant.MMI_RESPONSE_PROP_APP_DB] = requestObj[appez.mmi.constant.MMI_REQUEST_PROP_APP_DB];
		this.prepareResponse(true, dbResponseSuccessObj, 0, null);
	},
	
	fireReadQuery : function(smEventRequest) {
		var me = this;
		var sqlQuery = null;
		var smEventRequest = this.parent.smEventRequest;
		var reqData = smEventRequest.getServiceRequestData();
		reqData = appez.mmi.util.Base64.decode(reqData);
		reqData = JSON.parse(reqData);
		sqlQuery = reqData[appez.mmi.constant.MMI_REQUEST_PROP_QUERY_REQUEST];
		this.dbInstance.transaction(function(tx) {
			tx.executeSql(sqlQuery, [], 
					function (tx, results) {
						appez.mmi.log("READ Query successfully executed:"+JSON.stringify(results.rows));
						me.readQueryCallback(tx, results,me);
					}, 
					function (tx, results) {
						appez.mmi.log("Error executing READ query:"+JSON.stringify(results));
						me.prepareResponse(false, null, appez.mmi.constant.DB_OPERATION_ERROR, results);
					});
		});
		
		
	},
	
	readQueryCallback : function(tx, results, instance){
		var smEventRequest = this.parent.smEventRequest;
		var requestData = smEventRequest.getServiceRequestData();
		requestData = appez.mmi.util.Base64.decode(requestData);
    	var requestObj = JSON.parse(requestData);
    	var dbName = requestObj[appez.mmi.constant.MMI_REQUEST_PROP_APP_DB];
    	
		var me = this;
		var dbResponse = {};
		var allRowsElement = [];
		
		var len = results.rows.length, tableRows;
		if(len > 0){
			for (tableRows = 0; tableRows < len; tableRows++){
				 var currentRow = results.rows.item(tableRows);
				 var currentRowObj = {};
//				 dbResponse[appez.mmi.constant.DB_READ_QUERY_RESPONSE_RESULTSET][tableRows] = {};
				 for(var key in currentRow){
					 currentRowObj[key] = currentRow[key];
//					 dbResponse[appez.mmi.constant.DB_READ_QUERY_RESPONSE_RESULTSET][tableRows][key] = currentRow[key];
				 }
				 allRowsElement[tableRows] = currentRowObj;
			}
			dbResponse[appez.mmi.constant.MMI_RESPONSE_PROP_APP_DB] = dbName;
			dbResponse[appez.mmi.constant.MMI_RESPONSE_PROP_DB_RECORDS] = allRowsElement;
			
			appez.mmi.log("Database response:"+JSON.stringify(dbResponse));
			this.prepareResponse(true, dbResponse, 0, null);
		} else {
			dbResponse[appez.mmi.constant.MMI_RESPONSE_PROP_APP_DB] = dbName;
			dbResponse[appez.mmi.constant.MMI_RESPONSE_PROP_DB_RECORDS] = null;
			this.prepareResponse(true, dbResponse, 0, null);
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
	}
});	
