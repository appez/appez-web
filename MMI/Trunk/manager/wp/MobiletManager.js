
/** 
 * 
 *	This class represents a Mobilet Manager in Window Phone.
 *	Acts as a bridge between JS and Native layer, Responsible for communication between
 *      Java Script side and Client side.
 * 
 **/

appez.mmi.manager.wp.MobiletManager = appez.mmi.createClass({

	className:"appez.mmi.manager.wp.MobiletManager",
	singleton:true,
	extend:appez.mmi.manager.MobiletManager,
	
	processNativeRequest: function(serviceObj, smartEvent){
		var requestForNative = this.parent.processNativeRequest(serviceObj, smartEvent);
		this.doNativeCommunication(JSON.stringify(requestForNative));
	}, 
	
	processNotifierRequest : function(notifierObj, notifierEvent){
		appez.mmi.log('MobiletManager->WP->processNotifierRequest');
		var requestForNative = this.parent.processNotifierRequest(notifierObj, notifierEvent);
		this.doNativeCommunication(JSON.stringify(requestForNative));
	},
	
	processNativeResponse : function(responseFromNative){
		//Handle the native response here
		appez.mmi.log('MobiletManager->WP->Response from Native:'+responseFromNative);
		this.parent.processNativeResponse(responseFromNative);
	},
	
	processNotifierResponse : function(responseFromNative){
		appez.mmi.log('MobiletManager->WP->processNotifierResponse:'+responseFromNative);
		this.parent.processNotifierResponse(responseFromNative);
	},
	
	 /**
	 * Communicates user request to native layer
	 * 
	 * @param message: message which should be communicated to user.
	 *          
	 */
	
	doNativeCommunication: function(message) {
        window.external.notify("imr://"+message);   
	}
	
});