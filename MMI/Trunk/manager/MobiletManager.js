/** 
 * 
 *	This class represents a Mobilet manager.
 *	Responsible for communication between native layer and JS layer.
 * 
 **/

appez.mmi.manager.MobiletManager = appez.mmi.createClass({
	className:"appez.mmi.manager.MobiletManager",
	singleton:true,
	
	callingService : null,
	smartEvent : null,
	
	callingNotifier: null,
	notifierEvent: null,
	
	processNativeRequest: function(service, smEvent){
		appez.mmi.log('MobiletManager->generic->processNativeRequest:'+smEvent);
		this.callingService = service;
		this.smartEvent = smEvent;
		
		return appez.mmi.util.FrameworkUtil.prepareRequestObjForNative(smEvent);
	},                         	
	
	processNativeResponse : function(responseFromNative){
//		appez.mmi.log('MobiletManager->Response from Native:'+JSON.stringify(responseFromNative));
		var nativeResponse = responseFromNative;
		
		//Delegate this 'SmartEventResponse' to the current service
		var smEventResponse = new appez.mmi.model.SmartEventResponse();
		smEventResponse.setOperationComplete(nativeResponse[appez.mmi.constant.MMI_MESSAGE_PROP_TRANSACTION_RESPONSE][appez.mmi.constant.MMI_MESSAGE_PROP_TRANSACTION_OP_COMPLETE]);
		var serviceResponse = nativeResponse[appez.mmi.constant.MMI_MESSAGE_PROP_TRANSACTION_RESPONSE][appez.mmi.constant.MMI_MESSAGE_PROP_SERVICE_RESPONSE];
		serviceResponse = appez.mmi.base64Decode(serviceResponse);
		serviceResponse = JSON.parse(serviceResponse);
		smEventResponse.setServiceResponse(serviceResponse);
		smEventResponse.setExceptionType(nativeResponse[appez.mmi.constant.MMI_MESSAGE_PROP_TRANSACTION_RESPONSE][appez.mmi.constant.MMI_MESSAGE_PROP_RESPONSE_EX_TYPE]);
		smEventResponse.setExceptionMessage(nativeResponse[appez.mmi.constant.MMI_MESSAGE_PROP_TRANSACTION_RESPONSE][appez.mmi.constant.MMI_MESSAGE_PROP_RESPONSE_EX_MESSAGE]);
		this.smartEvent.setSmartEventResponse(smEventResponse);
		
		this.callingService.processResponse(smEventResponse);
	},
	
	processNotifierRequest : function(notifier, notEvent){
		appez.mmi.log('MobiletManager->generic->processNotifierRequest:'+notEvent);
		this.callingNotifier = notifier;
		this.notifierEvent = notEvent;
		
		return appez.mmi.util.FrameworkUtil.prepareNotifierObjForNative(notEvent);
	},
	
	processNotifierResponse : function(responseFromNative){
		var nativeResponse = responseFromNative;
		
		var notifierEventResponse = new appez.mmi.model.NotifierEventResponse();
		notifierEventResponse.setOperationComplete(responseFromNative[appez.mmi.constant.NOTIFIER_PROP_TRANSACTION_RESPONSE][appez.mmi.constant.NOTIFIER_OPERATION_IS_SUCCESS]);
		notifierEventResponse.setResponse(responseFromNative[appez.mmi.constant.NOTIFIER_PROP_TRANSACTION_RESPONSE][appez.mmi.constant.NOTIFIER_EVENT_RESPONSE]);
		notifierEventResponse.setErrorType(responseFromNative[appez.mmi.constant.NOTIFIER_PROP_TRANSACTION_RESPONSE][appez.mmi.constant.NOTIFIER_OPERATION_ERROR_TYPE]);
		notifierEventResponse.setErrorMessage(responseFromNative[appez.mmi.constant.NOTIFIER_PROP_TRANSACTION_RESPONSE][appez.mmi.constant.NOTIFIER_OPERATION_ERROR]);
		this.notifierEvent.setNotifierEventResponse(notifierEventResponse);
		
		this.callingNotifier.notifierResponse(notifierEventResponse);
	},
	
	notificationFromNative : function(notification) {
		appez.mmi.getNativeListenerFunction().call(appez.mmi.getNativeListenerScope(),notification);
	},
	
	getCurrentSmartEvent : function(){
		return this.smartEvent;
	},
	
	getCurrentNotifierEvent : function(){
		return this.notifierEvent;
	}
});
