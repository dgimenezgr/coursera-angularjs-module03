(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.constant('ApiEndpoint', 'https://davids-restaurant.herokuapp.com');

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    restrict: 'E',
    scope: {
      found: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'narrowItDownList',
    bindToController: true
  }

  return ddo;
}

function FoundItemsDirectiveController() {
  var narrowItDownList = this;

  narrowItDownList.isFoundEmpty = function() {
      if (narrowItDownList.found.length === 0 && narrowItDownList.found !== undefined) {
          return true;
      }
      return false;
  };
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrowItDownList = this;

  narrowItDownList.getMatchedItems = function () {
    // Call getMatchedMenuItems on Service as promise
    var promise = MenuSearchService.getMatchedMenuItems(narrowItDownList.term);

    // Concatenate success and catch error
    promise.then(function (result) {
      narrowItDownList.found = result;
    })
    .catch(function (error){
      console.log(error.message);
    });
  };

  /**
   * @method removeItem
   * @param Number itemIndex Index of Item to remove
   */
  narrowItDownList.removeItem = function (itemIndex) {
    narrowItDownList.found = MenuSearchService.removeItem(narrowItDownList.found, itemIndex);
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

  service.removeItem = function (items, itemIndex) {
    items.splice(itemIndex, 1);

    return items;
  };
}

})();
