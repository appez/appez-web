

/** 
 * 
 *	This class represents a Base class for all Controllers.
 *	Use to serve the basic skeleton for extending further based on specific implementation.
 * 
 **/

appez.smartweb.swcore.BaseController = appez.smartweb.createClass({
	className:"appez.smartweb.swcore.BaseController", //Contains Class Name
	menuId:undefined,                      //specify menu item for each screen , Bydefault it is undefined
	
	init : function(){
//		eMob.getViewManager().setCurrentController(this);
	},
	
	//Native event methods
	onPageInit : function(){
		
	},
	
	onBackKeyPressed : function(){
		
	},
	
	onMenuItemSelection : function(menuIdSelected){
		
	},
	
	getClassName : function(){
		return this.className;
	}
	//--------------------------------
});