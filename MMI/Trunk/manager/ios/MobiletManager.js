
/** 
 * 
 *	This class represents a Mobilet Manager in iOS.
 *	Acts as a bridge between JS and Native layer, Responsible for communication between
 *  Java Script side and Client side.
 * 
 **/


appez.mmi.manager.ios.MobiletManager = appez.mmi.createClass({
	className:"appez.mmi.manager.ios.MobiletManager",
	singleton:true,
	extend:appez.mmi.manager.MobiletManager,
	
	processNativeRequest: function(serviceObj, smartEvent){
		var requestForNative = this.parent.processNativeRequest(serviceObj, smartEvent);
		this.doNativeCommunication(JSON.stringify(requestForNative));
	},

	processNotifierRequest : function(notifierObj, notifierEvent){
		appez.mmi.log('MobiletManager->iOS->processNotifierRequest');
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
		appez.mmi.log('MobiletManager->iOS->Response from Native:'+responseFromNative);
		this.parent.processNativeResponse(responseFromNative);
	},
	
	processNotifierResponse : function(responseFromNative){
		appez.mmi.log('MobiletManager->iOS->processNotifierResponse:'+responseFromNative);
		this.parent.processNotifierResponse(responseFromNative);
	},
	
	 /**
	 * Communicates user request to native layer
	 * 
	 * @param message: message which should be communicated to user.
	 *          
	 */
	
	doNativeCommunication: function(message) {
      	//  document.location.href = "imr://"+message;   //changed iMr -> imr
	     var iframe = document.createElement("IFRAME");
	     iframe.setAttribute("src", "imr://"+message);
	     document.documentElement.appendChild(iframe);
	     iframe.parentNode.removeChild(iframe);
	     iframe = null;
	}
});