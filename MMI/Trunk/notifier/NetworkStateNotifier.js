/**
 * 
 */
appez.mmi.notifier.NetworkStateNotifier = appez.mmi.createClass({          
	className:"appez.mmi.notifier.NetworkStateNotifier", 	//Contains Class Name
	singleton:true,                                            		//specify whether the class is singleton object or not 
	extend:appez.mmi.notifier.SmartNotifier,                     //Contains Base Class Name
   
	callbackFunction : null,
	callbackFunctionScope : null,
	
	/*
	 * Name: processRequest
	 * Description: Execute SmartEventRequest object for native communication
	 * smartEventRequest: SmartEventRequest object
	 * Returns: None , transfer control to callBack method.
	 * Details about if any exception is thrown.
	 */
	register: function(notifierEvent, callbackFunc, callbackFuncScope){
		appez.mmi.log('NetworkStateNotifier->register');
		this.callbackFunction = callbackFunc;
		this.callbackFunctionScope = callbackFuncScope;
		try {
			appez.mmi.getMobiletManager().processNotifierRequest(this, notifierEvent);
		} catch(error){
			appez.mmi.log('NetworkStateNotifier->register->error message:'+error.message);
			this.notifyRegisterError(notifierEvent);
		}
	},
	
	unregister : function(notifierEvent, callbackFunc, callbackFuncScope){
		appez.mmi.log('NetworkStateNotifier->unregister');
		this.callbackFunction = callbackFunc;
		this.callbackFunctionScope = callbackFuncScope;
		try {
			appez.mmi.getMobiletManager().processNotifierRequest(this, notifierEvent);
		} catch(error){
			appez.mmi.log('NetworkStateNotifier->register->error message:'+error.message);
			this.notifyRegisterError(notifierEvent);
		}
	},
	
	notifierResponse : function(notifierResponse){
		this.callbackFunction.call(this.callbackFunctionScope, notifierResponse);
	},
	
	notifyRegisterError : function(notifierEvent){
		var notifierEventResponse = new appez.mmi.model.NotifierEventResponse();
		notifierEventResponse.setOperationComplete(false);
		notifierEventResponse.setResponse(null);
		notifierEventResponse.setErrorType(appez.mmi.constant.NOTIFIER_REQUEST_INVALID);
		notifierEventResponse.setErrorMessage(appez.mmi.constant.NOTIFIER_REQUEST_INVALID_MESSAGE);
		this.callbackFunction.call(this.callbackFunctionScope, notifierEventResponse);
	}	
});	