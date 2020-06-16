(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.factory('MenuSearchFactory', MenuSearchFactory)
.directive('foundItems', FoundItemsDirective)
.constant('ApiEndpoint', 'https://davids-restaurant.herokuapp.com');

function FoundItemsDirective() {
  var ddo = {
    scope: {
      found: '<',
      onRemove: '&'
    },
    templateUrl: "foundItems.html",
    controller: FoundItemsDirectiveController,
    controllerAs: 'nidCtrl',
    bindToController: true
  }

  return ddo;
}

function FoundItemsDirectiveController() {
  var items = this;
}

NarrowItDownController.$inject = ['MenuSearchFactory'];
function NarrowItDownController(MenuSearchFactory) {
  var narrowItDownList = this;

  var menuSearchList = MenuSearchFactory();
  
  /** Variable declaration **/
  narrowItDownList.term = "";

  narrowItDownList.getMatchedItems = function () {

  // narrowItDownList.found = menuSearchList.getMatchedMenuItems(narrowItDownList.term);

  // console.log(narrowItDownList.found);


      var promise = menuSearchList.getMatchedMenuItems(narrowItDownList.term);

      promise.then(function (response) {
        narrowItDownList.found = response;
      })
      .catch(function (){
        console.log('Not working');
      });
  };

  narrowItDownList.removeItem = function (itemIndex) {
    menuSearchList.removeItem(itemIndex);
  };

}

MenuSearchService.$inject = ['$http','ApiEndpoint'];
function MenuSearchService($http,ApiEndpoint) {
  var service = this;
  
  service.getMatchedMenuItems = function (term) {
    return $http({
      method: "GET",
      url: (ApiEndpoint + "/menu_items.json")
    }).then(function(result) {
      var foundItems = result.data.menu_items.filter( function(e) {
        return e.description.toLowerCase().includes(term.toLowerCase());
      });

      return foundItems;
    });
  }    

  service.filterMenuItems = function (response, term) {
    var found = response.menu_items.filter( function(e) {
      return e.description.toLowerCase().includes(term.toLowerCase());
    });

    return found;
  };

  service.removeItem = function (itemIndex) {
    found.splice(itemIndex, 1);
  };
}

MenuSearchFactory.$inject = ['$http','ApiEndpoint'];
function MenuSearchFactory($http,ApiEndpoint) {
  var factory = function () {
    return new MenuSearchService($http,ApiEndpoint);
  };

  return factory;
}

})();
