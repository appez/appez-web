/**
 * SmartNotifier.js: 
 * Base class of the notifiers. All individual notifier classes are derived
 * from SmartNotifier.
 * 
 */
appez.mmi.notifier.SmartNotifier = appez.mmi.createClass({
	className:"appez.mmi.notifier.SmartNotifier",         //Contains Class Name
	singleton:true,                                     //specify whethet the class is singleton object or not 
	regParameters : null,								//JSON object containing the registration parameters
    
	register : function(registerParams){
		
	},
	
	unregister : function(registerParams){
		
	}
});