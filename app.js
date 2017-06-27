(function(){
  'use strict';

  angular
    .module("Simon", [])
    .controller("SimonController", SimonController);

  SimonController.$inject= ['$scope','$timeout', '$interval'];

  function SimonController($scope, $timeout, $interval){
    var vm = this;
    vm.checked = false;
    vm.lost = false;
    vm.count  = 0;
    vm.start = false;
    vm.indxs = [0,1,2,3];
    vm.random = [];
    vm.humanIndxs = [];
    vm.strict = false;
    vm.lost = false;
    vm.showState = false;
    var timeout, messageTimeout, flashMessage, clickTimeout;
    var counter = 4000;

    vm.onOff = function(checked){
      clearTimeout();
      vm.count = 0;
      vm.checked = checked;
      vm.showCount();
      if(!vm.checked){
        vm.showState = '- -';
        vm.start = false;
        vm.strict = false;
        vm.lost = false;
      }
    }

    vm.strictOnOff = function(){
      if(vm.checked){
        vm.strict = !vm.strict;
      }
    }

    vm.startFn = function(){
      if(vm.checked){
        clearTimeout();
        vm.start = true;
        counter = 4000;
        vm.count = 1;
        vm.random = [];
        vm.humanIndxs = [];
        vm.lost = false;
        vm.go();
      }
    }

    vm.go = function(){
      $timeout.cancel(timeout);
      $timeout.cancel(clickTimeout);
      vm.showCount();
      var randomIndex = 0;
      for(var i=0; i< vm.count; i++){
        randomIndex = Math.floor(Math.random()*4);
        vm.random.push(randomIndex);
        waitTime(i, randomIndex);
      }
      unClickAble();
      clickTimeout = $timeout(clickAble, counter/2.7);
      timeout = $timeout(checkIndxs, counter);
    }

    function waitTime(i, rIndx){
      $timeout(function(){
        switch(rIndx){
          case 0:
            getId(rIndx).style.background = '#13ff7c';
            $timeout(function(){
              getId(rIndx).style.background = '#00A74A';
            }, 500);
            break;
          case 1:
            getId(rIndx).style.background = 'red';
            $timeout(function(){
              getId(rIndx).style.background = '#9F0F17';
            }, 500);
            break;
          case 2:
            getId(rIndx).style.background = 'yellow';
            $timeout(function(){
              getId(rIndx).style.background = '#CCA707';
            }, 500);
            break;
          case 3:
            getId(rIndx).style.background = '#1c8cff';
            $timeout(function(){
              getId(rIndx).style.background = '#094A8F';
            }, 500);
            break;
          default:
            break;
        }
      }, i * 1000);
    }

    vm.turnHuman = function(indx){
      vm.humanIndxs.push(indx);
      changeColor(indx);
    }

    function checkIndxs(){
      if(vm.random.length === vm.humanIndxs.length){
        for(var i=0; i <= vm.random.length; i++){
          if(vm.random[i] == vm.humanIndxs[i]){
            continue;
          }else{
            vm.lost = true;
            if(vm.checked && vm.strict){
              vm.count = 1;
              counter = 4000;
            }
            stateClear();
            return false;
          }
        }
        if(vm.checked){
          vm.lost = false;
          vm.count += 1;
          counter += 2000;
        }
        stateClear();
      }else{
        vm.lost = true;
        if(vm.checked && vm.strict){
          vm.count = 1;
          counter = 4000;
        }
        stateClear();
        return false;
      }
    }

    function stateClear(){
      vm.random=[]; 
      vm.humanIndxs = [];
      clickTimeout = $timeout(clickAble, counter/2.7);
      timeout = $timeout(checkIndxs, counter);
      vm.go();
    }

    function changeColor(rIndx){
      switch(rIndx){
        case 0:
          getId(rIndx).style.background = '#13ff7c';
          $timeout(function(){
            getId(rIndx).style.background = '#00A74A';
          }, 100);
          break;
        case 1:
          getId(rIndx).style.background = 'red';
          $timeout(function(){
            getId(rIndx).style.background = '#9F0F17';
          }, 100);
          break;
        case 2:
          getId(rIndx).style.background = 'yellow';
          $timeout(function(){
            getId(rIndx).style.background = '#CCA707';
          }, 100);
          break;
        case 3:
          getId(rIndx).style.background = '#1c8cff';
          $timeout(function(){
            getId(rIndx).style.background = '#094A8F';
          }, 100);
          break;
        default:
          break;
      }
    }

    function getId(id){
      return document.getElementById(id);
    }

    function unClickAble(){
      $('.color').addClass('not-allow-click');
    }

    function clickAble(){
      $('.color').removeClass('not-allow-click');
    }

    vm.showCount = function(){
      if(vm.checked && !vm.start){
        return vm.showState = '- -';
      }else{
        if(!vm.lost){
          isLessThanTen()
        }else{
          vm.showState = '! !';
          flashingText()
          messageTimeout = $timeout(function(){
            isLessThanTen()
          }, 1200);
        }
      }
    }

    function isLessThanTen(){
      return vm.showState = vm.count < 10 ? '0'+vm.count : vm.count;
    }

    function flashingText(){
      vm.blinkMe = true;
      flashMessage = $timeout(function(){
        vm.blinkMe=false;
      }, 1000);
    }

    function clearTimeout(){
      $timeout.cancel(timeout);
      $timeout.cancel(clickTimeout);
      $timeout.cancel(messageTimeout);
      $timeout.cancel(flashMessage);
    }

  }

})();