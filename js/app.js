App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
});

App.IndexRoute = Ember.Route.extend({ 
});

App.IndexView = Ember.View.extend({
	click:function(event){
		var rightPanel= this.$('#rightPanel'),
			elem = $(event.target),meanNode;
		if(elem.hasClass('meanclose')){
			meanNode = elem.closest('.meanDef').remove();
			event.stopPropagation();
		} else if(elem.hasClass('meanhead')){
			this.showHideContent(elem.closest('.meanDef'),'.meanbody',true);			
		} else if(elem.hasClass('clearAll')){
			rightPanel.find('.meanDef').remove();
		}
	},
	mouseUp:function(event){
		var selectedObj = this.getSelectedText(),
			controller = this.get("controller"),
			word = selectedObj.toString();
		if(word!= ''){
			console.log(word);
			if(!controller.send("wordAlreadyExist", word)){
				this.showHideContent(this.$('#rightPanel'), '.meanbody', false);
				controller.send("getMeaningForWord", word);// Call to controller function
			} else {				
			}
			
		}
	},// To get the selected text
	getSelectedText :function(){
		var text = '';
		if(window.getSelection){
			text = window.getSelection();
		}else if(document.getSelection){
			text = document.getSelection();
		}else if(document.selection){
			text = document.selection.createRange().text;
		}
		return text;
	}, // To show/hide right panel content
	showHideContent:function(elem, className, toggle){
		var node;
		if(toggle){
			node = elem.find(className);
			if(node.css('display') !== 'none'){
				node.css('display', 'none');
			} else{
				node.css('display', 'block');
			}
		}else{
			elem.find(className).css('display', 'none')
		}
		
	}
});
//IndexController
App.IndexController = Ember.ObjectController.extend({
	paraContent:'',
	wordMeaningsArr:[],//Contains words with definitions
	//Get the meaning of the word using swagger api
	getMeaningForWord:function(word){		
		var self=this, params = {};
        var opts = {        	
          requestContentType: null,
          responseContentType: "application/json"
        };		
		swaggerUi.word.getDefinitions({word: word.trim().toLowerCase()}, function(definitions) {
		    var len = definitions.length,wordDefinitionObj = {
			  	word:word,
			  	definitions:[]
			  }		
			if(len>0){   
	           for (var i = 0; i < len; i++) {
	             var definition = definitions[i];
	             wordDefinitionObj.definitions.push({
	             	partOfSpeech:definition.partOfSpeech,
	             	meaning:definition.text
	             });
	             //console.log(definition.partOfSpeech + ": " + definition.text);
	           }
	           self.wordMeaningsArr.pushObject(wordDefinitionObj);
		  	}
		}); 
		
	},//Word Allready exists or not
	wordAlreadyExist:function(word){
		var doesExist=false, arr = this.wordMeaningsArr,
		arrLength= arr.length;
		for(;arrLength>0;arrLength--){
			if(arr[arrLength-1].word === word){
				doesExist = true;
				break;
			}
		}
		return doesExist;
	}	
});
