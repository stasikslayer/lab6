'use strict';

var app = angular.module('myApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ngStorage', 'rzModule']);



app.controller('myCtrl', function($scope,  $http, $mdDialog, $localStorage) {
      $scope.visible=true;
      $scope.items;
      $scope.itemsSearch;
      $scope.selectedItem;
      $scope.brands;
      $scope.characteristics;
      $scope.selectedBrands;
      $scope.storage;
      var temp=false;
      

      var url = 'https://jsworkshop.000webhostapp.com/?model=category'
      
      var request = $http.get(url)
      .then(function(response) {
        $scope.categories = response.data;
      });
      
      var url = 'https://jsworkshop.000webhostapp.com/?model=product'
      
      var request = $http.get(url)
      .then(function(response) {
        $scope.items = response.data;
      });
      $scope.selectCategory=function(){
        $scope.brands=[];
        $scope.characteristics=[];
        $scope.characteristicName=[];
        $scope.selectedBrands=[];
        $scope.storage=[];
        $scope.slider = {
        minValue: 10,
        maxValue: 5000,
        options: {
          floor: 10,
          ceil: 5000,
          step: 1
          }
        };

        showItems();
        
        $scope.brands.push($scope.itemsSearch[0].brand);
        for (var i = 1; i < $scope.itemsSearch.length; i++) {   
          for (var j = 0; j < $scope.brands.length; j++) {
            if ($scope.brands[j]==$scope.itemsSearch[i].brand) {
              temp=true;
            }                      
          } 
          if (!temp) {
            $scope.brands.push($scope.itemsSearch[i].brand);
          }   
            temp=false;        
        }          
      }

      
      $scope.changedBrand = function(){
        showItems();
      }

      function showItems(){
        $scope.itemsSearch=[]
        for (var i = 0; i < $scope.items.length; i++) {
          for (var j = 0; j < $scope.items[i].category.length; j++) {
            if ($scope.items[i].category[j].name==$scope.selectedCategory) {
              if ($scope.selectedBrands[0]){
                for (var k = 0; k < $scope.selectedBrands.length; k++){
                  if ($scope.items[i].brand==$scope.selectedBrands[k]){
                    $scope.itemsSearch.push($scope.items[i])
                  }
                }
              }
              else{
                $scope.itemsSearch.push($scope.items[i])
              }
            }
          }            
        }
      }

      $scope.hide=function(){
        if ($scope.visible) {
          $scope.visible=false;
        }
        else{
          $scope.visible=true;
        }
      }

      $scope.selectItem = function(item,ev) {
        $mdDialog.show({
          controller: modalController,
          templateUrl: 'modal.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          locals: {
            selectedItem: item
          },
          fullscreen: $scope.customFullscreen
        });    
      };

      function modalController($scope, $mdDialog, selectedItem) {
        $scope.item=selectedItem;
        $scope.shops=[];
        $scope.selectedShop=[];
        var url = 'https://jsworkshop.000webhostapp.com/?model=shop'
          
          var request = $http.get(url)
          .then(function(response) {
            console.log(response.data);
            $scope.items = response.data; 
            for (var i = 0; i < response.data.length; i++) {
              for (var j = 0; j < response.data[i].stock.length; j++) {
                if (response.data[i].stock[j].product.name == $scope.item.name) {
                  $scope.shops.push(response.data[i].stock[j]);
                }
                
              }
              $scope.shops[i].cost*=(1-response.data[i].sale);
              $scope.shops[i].name=response.data[i].name;
            } 
            console.log($scope.selectedShop);

          });

          

          $scope.buy=function(){
            $scope.storage=$localStorage.items
            if($scope.selectedShop){
              $scope.storage.push($scope.selectedShop);
              $localStorage.items=$scope.storage;
            }
            
            
            console.log($localStorage.items);
          }

          $scope.load=function(){
          }
        }

        $scope.storage = function(item,ev) {
        $mdDialog.show({
          controller: storageController,
          templateUrl: 'storage.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen
        });    
      };

      function storageController(){
        $scope.storage=$localStorage.items;
        console.log($scope.storage)

      }
})
