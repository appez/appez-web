/** 
 * 
 *	This class represents a Mobilet Manager in Android.
 *	Acts as a bridge between JS and Native layer, Responsible for communication between
 *  Java Script side and Client side.
 * 
 **/
appez.mmi.manager.android.MobiletManager = appez.mmi.createClass({
	className:"appez.mmi.manager.android.MobiletManager",
	singleton:true,
	extend:appez.mmi.manager.MobiletManager,
	
	processNativeRequest: function(serviceObj, smartEvent){
		var requestForNative = this.parent.processNativeRequest(serviceObj, smartEvent);
		this.doNativeCommunication(JSON.stringify(requestForNative));
	},                         	
	
	processNotifierRequest : function(notifierObj, notifierEvent){
		appez.mmi.log('MobiletManager->Android->processNotifierRequest');
		var requestForNative = this.parent.processNotifierRequest(notifierObj, notifierEvent);
		this.doNativeCommunication(JSON.stringify(requestForNative));
	},
	
	/*
	 * Name: processNativeResponse
	 * Description: Processes and decode the response that comes from native layer
	 * @Params responseFromNative: response from native
	 * Returns: None
	 * Details about if any exception is thrown
	 */
	
	processNativeResponse : function(responseFromNative){
		//Handle the native response here
		appez.mmi.log('MobiletManager->Android->Response from Native:'+responseFromNative);
		this.parent.processNativeResponse(responseFromNative);
	},
	
	processNotifierResponse : function(responseFromNative){
		appez.mmi.log('MobiletManager->Android->processNotifierResponse:'+responseFromNative);
		this.parent.processNotifierResponse(responseFromNative);
	},
	
	 /**
	 * Communicates user request to native layer
	 * 
	 * @param message: message which should be communicated to user.
	 * 
	 */
	
	doNativeCommunication : function(message) {
		appez.mmi.log('MobiletManager->Android->Request for native:'+message);
		appezAndroid.onReceiveEvent(message);
	}
	
	/*doNotifierCommunication : function(message){
		appez.mmi.log('MobiletManager->Android->doNotifierCommunication:'+message);
		appezAndroid.onRegisterNotifier(message);
	}*/
});