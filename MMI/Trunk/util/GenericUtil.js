appez.mmi.util.GenericUtil = appez.mmi.createClass({
	className:"appez.mmi.util.GenericUtil", //Contains The Class Name.
    singleton:true,
    
    isValidHexColor : function(hexCodeToCheck){
    	var isOk  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hexCodeToCheck);
    	return isOk;
    }

});