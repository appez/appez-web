/**
 * Provides a wrapper by which the user can use the services of the appez SmartWeb layer
 * 
 * Implementation specifications-
 * 1. User now needs to register the controller for it to get the click/tap event callbacks as defined in the ScreenTemplates.xml. For that the 'setCurrentController()' needs to be used
 * 
 * */
appez.smartweb = {
		util : {
			"graph":{}
		},
		manager : {},
		model : {},
		swcore : {},
		
		currentController : {},
		
		init : function(){
			appez.smartweb.manager.StackManager.init();
			//Read the contents of the 'ScreenTemplates.xml' file
			appez.smartweb.manager.ApplicationManager.initScreenTemplates();
		},
		
		createClass : function(memberVariables) {
			return appez.smartweb.util.ClassManager.createClass(memberVariables);
		},
		
		initApplication : function(appConfig){
			var app = appez.smartweb.manager.ApplicationManager.initApplication(appConfig);
			return app;
		},
		
		getApplication : function(){
			return appez.smartweb.manager.ApplicationManager.application;
		},
		
		setCurrentController : function(curController){
			this.currentController = curController;
		},
		
		getCurrentController : function(){
			//TODO Need to see how user current controller can be derived
			return this.currentController;
		},
				
		navigateTo : function(pageId, controllerObj){
			appez.smartweb.manager.StackManager.navigateTo(pageId, controllerObj);
		},
		
		navigateBack : function(previousPage){
			appez.smartweb.manager.StackManager.navigateBack(previousPage);
		},
		
		drawBarChart : function(chartReqdata){
			if(chartReqdata){
				if((chartReqdata[appez.smartweb.constant.CHART_REQ_PARAM_TARGET_DIV]!=undefined)&&(chartReqdata[appez.smartweb.constant.CHART_REQ_PARAM_DATA]!=undefined)){
					chartReqdata[appez.smartweb.constant.CHART_REQ_PARAM_GRAPH_TYPE] = appez.smartweb.constant.CHART_TYPE_BAR;
					appez.smartweb.util.graph.GraphAdapter.drawGraph(chartReqdata);
				} else {
					//Show an error since the required parameters are not present
					console.error(appez.smartweb.constant.ERROR_MSG_MISSING_REQUIRED_FIELD);
				}
			} else {
				//Show an error since the required parameters are not present
				console.error(appez.smartweb.constant.ERROR_MSG_UNDEFINED_GRAPH_REQUEST);
			}
		},
		
		drawPieChart : function(chartReqdata){
			if(chartReqdata){
				if((chartReqdata[appez.smartweb.constant.CHART_REQ_PARAM_TARGET_DIV]!=undefined)&&(chartReqdata[appez.smartweb.constant.CHART_REQ_PARAM_DATA]!=undefined)){
					chartReqdata[appez.smartweb.constant.CHART_REQ_PARAM_GRAPH_TYPE] = appez.smartweb.constant.CHART_TYPE_PIE;
					appez.smartweb.util.graph.GraphAdapter.drawGraph(chartReqdata);
				} else {
					//Show an error since the required parameters are not present
					console.error(appez.smartweb.constant.ERROR_MSG_MISSING_REQUIRED_FIELD);
				}
			} else {
				//Show an error since the required parameters are not present
				console.error(appez.smartweb.constant.ERROR_MSG_UNDEFINED_GRAPH_REQUEST);
			}
		},
		
		drawLineChart : function(chartReqdata){
			if(chartReqdata){
				if((chartReqdata[appez.smartweb.constant.CHART_REQ_PARAM_TARGET_DIV]!=undefined)&&(chartReqdata[appez.smartweb.constant.CHART_REQ_PARAM_DATA]!=undefined)){
					chartReqdata[appez.smartweb.constant.CHART_REQ_PARAM_GRAPH_TYPE] = appez.smartweb.constant.CHART_TYPE_LINE;
					appez.smartweb.util.graph.GraphAdapter.drawGraph(chartReqdata);
				} else {
					//Show an error since the required parameters are not present
					console.error(appez.smartweb.constant.ERROR_MSG_MISSING_REQUIRED_FIELD);
				}
			} else {
				//Show an error since the required parameters are not present
				console.error(appez.smartweb.constant.ERROR_MSG_UNDEFINED_GRAPH_REQUEST);
			}
		},
		
		drawDoughnutChart : function(chartReqdata){
			if(chartReqdata){
				if((chartReqdata[appez.smartweb.constant.CHART_REQ_PARAM_TARGET_DIV]!=undefined)&&(chartReqdata[appez.smartweb.constant.CHART_REQ_PARAM_DATA]!=undefined)){
					chartReqdata[appez.smartweb.constant.CHART_REQ_PARAM_GRAPH_TYPE] = appez.smartweb.constant.CHART_TYPE_DOUGHNUT;
					appez.smartweb.util.graph.GraphAdapter.drawGraph(chartReqdata);
				} else {
					//Show an error since the required parameters are not present
					console.error(appez.smartweb.constant.ERROR_MSG_MISSING_REQUIRED_FIELD);
				}
			} else {
				//Show an error since the required parameters are not present
				console.error(appez.smartweb.constant.ERROR_MSG_UNDEFINED_GRAPH_REQUEST);
			}
		}
}