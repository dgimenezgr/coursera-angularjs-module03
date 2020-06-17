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
    bindToController: true,
    link: FoundItemsDirectiveLink
  }

  return ddo;
}

function FoundItemsDirectiveLink(scope, element, attrs, controller) {
  scope.$watch('narrowItDownList.isFoundEmpty()', function (newValue, oldValue) {
    if (newValue === true) {
      displayEmptyWarning();
    }
    else {
      removeEmptyWarning();
    }
  });

  function displayEmptyWarning() {
    var warningElem = element.find("div.empty-warning");
    warningElem.fadeIn();
  }


  function removeEmptyWarning() {
    var warningElem = element.find("div.empty-warning");
    warningElem.fadeOut();
  }

}

function FoundItemsDirectiveController() {
  var narrowItDownList = this;

  narrowItDownList.isFoundEmpty = function() {
    if (narrowItDownList.found !== undefined) {
        if (narrowItDownList.found.length === 0) {
            return true;
        }
        return false;
    }
  };
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrowItDownList = this;

  narrowItDownList.getMatchedItems = function () {
    if (narrowItDownList.term === undefined || narrowItDownList.term === "") {
      narrowItDownList.found = [];
    } else {
      // Call getMatchedMenuItems on Service as promise
      var promise = MenuSearchService.getMatchedMenuItems(narrowItDownList.term);

      // Concatenate success and catch error
      promise.then(function (result) {
        narrowItDownList.found = result;
      })
      .catch(function (error){
        console.log(error.message);
      });
    }
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
