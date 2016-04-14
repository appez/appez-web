/** Provides support for the persistence storage at the web layer. 
 * At web layer, this service makes use of 'localStorage' for storing persistent data. 
 * 
 */
appez.mmi.service.web.PersistenceService = appez.mmi.createClass({          
	className:"appez.mmi.service.web.PersistenceService",     //Contains Class Name
	singleton:true,                                    	 //specify whether the class is singleton object or not ,By default service classes are singleton
	extend:appez.mmi.service.SmartEventService,               //Contains Base Class Name
	
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
		this.callbackFunction = callbackFunc;
		this.callbackFunctionScope = callbackFuncScope;
		this.smartEvent = smEvent;
		
		var smartEventRequest = smEvent.getSmartEventRequest();
		this.parent.smEventRequest = smartEventRequest;
		switch(smartEventRequest.getServiceOperationId()){
		//Add cases for handling saving, retrieving and deleting data from persistence
		case appez.mmi.constant.WEB_SAVE_DATA_PERSISTENCE:
			this.saveDataToPersistence();
			break;
			
		case appez.mmi.constant.WEB_RETRIEVE_DATA_PERSISTENCE:
			this.retrieveDataFromPersistence();
			break;
			
		case appez.mmi.constant.WEB_DELETE_DATA_PERSISTENCE:
			this.deleteDataFromPersistence();
			break;	
		}
	},
	
	saveDataToPersistence : function(){
        var dataStr = this.parent.smEventRequest.getServiceRequestData();
        if(dataStr!=null && dataStr.length>0){
        	dataStr = appez.mmi.util.Base64.decode(dataStr);
        	var dataToSave = JSON.parse(dataStr);
        	var storeName = dataToSave[appez.mmi.constant.MMI_REQUEST_PROP_STORE_NAME];
        	var serviceResponse = null;
        	var persistentStorageData = {};
        	if(storeName in localStorage){
            	persistentStorageData = JSON.parse(localStorage.getItem(storeName));
            } 
        	var dataToSave = dataToSave[appez.mmi.constant.MMI_REQUEST_PROP_PERSIST_REQ_DATA];
        	if(dataToSave!=undefined && dataToSave!=null && (dataToSave instanceof Array)){
        		var elementsInArray = dataToSave.length;
        		for(var fieldToSave=0;fieldToSave<elementsInArray;fieldToSave++){
        			var currentElement = dataToSave[fieldToSave];
        			persistentStorageData[currentElement[appez.mmi.constant.MMI_REQUEST_PROP_PERSIST_KEY]] = currentElement[appez.mmi.constant.MMI_REQUEST_PROP_PERSIST_VALUE];
        		}
        		localStorage.setItem(storeName, JSON.stringify(persistentStorageData));
        		//appez.mmi.log("Data to save:Store name:"+storeName+",data to store:"+JSON.stringify(dataToSave));
        		var storeResponseObj = {};
				storeResponseObj[appez.mmi.constant.MMI_RESPONSE_PROP_STORE_NAME] = storeName;
				storeResponseObj[appez.mmi.constant.MMI_RESPONSE_PROP_STORE_RETURN_DATA] = null;
				serviceResponse = storeResponseObj;
        	} else {
        		//TODO handle this by sending the error in response
        	}
            
            this.prepareResponse(true, serviceResponse, 0, null);
        }
	},

	retrieveDataFromPersistence : function(){
		var retrieveFilter = this.parent.smEventRequest.getServiceRequestData();
		if(retrieveFilter!=null && retrieveFilter.length>0){
			retrieveFilter = appez.mmi.util.Base64.decode(retrieveFilter);
			retrieveFilter = JSON.parse(retrieveFilter);
			var storeName = retrieveFilter[appez.mmi.constant.MMI_REQUEST_PROP_STORE_NAME];
			var serviceResponse = null;
			var retrieveDataString = "";
			var retrieveParameters = retrieveFilter[appez.mmi.constant.MMI_REQUEST_PROP_PERSIST_REQ_DATA];
			var retrievedElementsArray = [];
			
			var responseElement = {};
			//If all the records needs to be retrieved for a particular SharedPreference
			if(retrieveParameters[0][appez.mmi.constant.MMI_REQUEST_PROP_PERSIST_KEY]==appez.mmi.constant.RETRIEVE_ALL_FROM_PERSISTENCE){
				var localStorageData = JSON.parse(localStorage.getItem(storeName));
				var elementArrayIndex = 0;
				for(var key in localStorageData){
					appez.mmi.log("Retrieved key:"+key+",with value:"+localStorageData[key]);
					responseElement = {};
					responseElement[appez.mmi.constant.MMI_RESPONSE_PROP_STORE_KEY] = key;
					responseElement[appez.mmi.constant.MMI_RESPONSE_PROP_STORE_VALUE] = localStorageData[key];
					retrievedElementsArray[elementArrayIndex] = responseElement;
					elementArrayIndex = elementArrayIndex+1;
//					retrieveDataString = retrieveDataString + key + appez.mmi.constant.PERSISTENT_DATA_KEY_VALUE_SEPARATOR + localStorageData[key] + appez.mmi.constant.PERSISTENT_RESPONSE_KEY_VALUE_PAIR_SEPARATOR; 
				}
			} 
			//If record needs to be retrieved based on the key
			else {
				var localStorageData = JSON.parse(localStorage.getItem(storeName));	
				if(localStorageData!=null && localStorageData!=undefined){
					var keysToRetrieveCount = retrieveParameters.length;
					var elementArrayIndex = 0;
					for(var currentKey=0;currentKey<keysToRetrieveCount;currentKey++){
						responseElement[appez.mmi.constant.MMI_RESPONSE_PROP_STORE_KEY] = retrieveParameters[currentKey][appez.mmi.constant.MMI_REQUEST_PROP_PERSIST_KEY];
						responseElement[appez.mmi.constant.MMI_RESPONSE_PROP_STORE_VALUE] = localStorageData[retrieveParameters[currentKey][appez.mmi.constant.MMI_REQUEST_PROP_PERSIST_KEY]];
						retrievedElementsArray[elementArrayIndex] = responseElement;
						elementArrayIndex = elementArrayIndex+1;
					}
				} else {
					retrieveDataString = null;
				}
			}
			var storeResponseObj = {};
			storeResponseObj[appez.mmi.constant.MMI_RESPONSE_PROP_STORE_NAME] = storeName;
			storeResponseObj[appez.mmi.constant.MMI_RESPONSE_PROP_STORE_RETURN_DATA] = JSON.stringify(retrievedElementsArray);
			serviceResponse = storeResponseObj;
			this.prepareResponse(true, serviceResponse, 0, null);
		} else {
			//TODO handle this error scenario
		}
	},
	
	deleteDataFromPersistence : function(){
		var dataStr = this.parent.smEventRequest.getServiceRequestData();
		if(dataStr!=null && dataStr.length>0){
        	dataStr = appez.mmi.util.Base64.decode(dataStr);
        	var dataToDelete = JSON.parse(dataStr);
        	var storeName = dataToDelete[appez.mmi.constant.MMI_REQUEST_PROP_STORE_NAME];
        	var serviceResponse = null;
        	var persistentStorageData = {};
        	dataToDelete = dataToDelete[appez.mmi.constant.MMI_REQUEST_PROP_PERSIST_REQ_DATA];
        	var itemsToDelete = dataToDelete.length;
    		if(itemsToDelete>=1){
    			var elementsInStorage = JSON.parse(localStorage.getItem(storeName));
    			if(elementsInStorage!=null && elementsInStorage!=undefined){
    				//need to check the number of elements for more than one to ensure that at least one key has been specified by the user for deletion
    				for(var nodeToDelete=0;nodeToDelete<itemsToDelete;nodeToDelete++){
    					//appez.mmi.log("Data to delete:Store name:"+storeName+",data to remove:"+dataToDelete[nodeToDelete][appez.mmi.constant.MMI_REQUEST_PROP_PERSIST_KEY]);
    					//check if the persistence store exists or not
    					if(storeName in localStorage){
    						delete elementsInStorage[dataToDelete[nodeToDelete][appez.mmi.constant.MMI_REQUEST_PROP_PERSIST_KEY]];
    					}
    				}
    				//once the loop has been traversed, that means all the required keys have been removed from the storage variable
    				//now we need to save the elements back into the 'localStorage'
    				//appez.mmi.log("DELETE DATA FROM PERSISTENCE->new data to save:"+JSON.stringify(elementsInStorage));
    				localStorage.setItem(storeName,JSON.stringify(elementsInStorage));
    			}    			
    		}
    		
    		var storeResponseObj = {};
    		storeResponseObj[appez.mmi.constant.MMI_RESPONSE_PROP_STORE_NAME] = storeName;
    		storeResponseObj[appez.mmi.constant.MMI_RESPONSE_PROP_STORE_RETURN_DATA] = null;
    		serviceResponse = storeResponseObj;
    		this.prepareResponse(true, serviceResponse, 0, null);
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
