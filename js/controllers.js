/**
 * Created by Janek on 2015-04-29.
 */
var module = angular.module('SimulinkJS', ['ui.bootstrap']);
module.controller('ToolboxController', ToolboxController);
module.controller('ButtonsController', ButtonsController);
module.controller('ModelController', ModelController);

function ToolboxController($scope, $rootScope) {
    $(document).ready(function(){
        hideToolsBtnDuringChangingTab();
        initializeBlocksInToolboxDraggable();
    });

    $scope.groups = [
        {
            title: 'Sources',
            content: ['step']
        },
        {
            title: 'Continuous',
            content: ['integrator', 'transferFcn', 'pid']
        },
        {
            title: 'Sinks',
            content: ['scope']
        }
    ];

    function initializeBlocksInToolboxDraggable() {
        $('.blockInToolbox').each(function(){
            $(this).draggable( {
                cursor: 'move',
                start: function(event, ui) {
//                    console.log('START');
                },
                stop: function(event, ui) {
                    $(this).css('left','0px');
                    $(this).css('top','0px');
                }
            });
        });

        $('#modelPane').droppable({
            accept: '#toolbox div',
            drop: handleBlockDrop
        });
    }

    function handleBlockDrop(event, ui) {
        $rootScope.$broadcast('addedBlock', ui);
    }

    function hideToolsBtnDuringChangingTab() {
        $('#tabBtns a').click(function (e) {
            if(this.getAttribute('id') === 'model')
                $('#toolsBtn').fadeTo(0, 1);
            else
                $('#toolsBtn').fadeTo(0, 0);
            e.preventDefault();
            $(this).tab('show');
        });
    }

}

function ButtonsController($scope) {
    var openedToolbox = true;
    $scope.changeToolbox = function() {
            openedToolbox = !openedToolbox;
            if(openedToolbox) {
                    $('#modelPane').removeClass('closedToolbox');
                    $('#modelPane').addClass('openedToolbox');
            }
            else {
                setTimeout(function() {
                        $('#modelPane').removeClass('openedToolbox');
                        $('#modelPane').addClass('closedToolbox');
                }, 400);
            }
        };
    $scope.testClick = function() {
        var temp = plumb.getAllEndpoints('step0')[0];
        temp.setAnchor('Left');
    }
}

function ModelController($scope, $rootScope) {
    $scope.blocks = [];

    function getBlockIndex(name) {
        for(i=0; i<$scope.blocks.length; i++) {
            if($scope.blocks[i].name === name)
                return i;
        }
    }


    function deleteBlock(name) {
        plumb.deleteConnectionsInBlock(name);
        $scope.blocks.remove(getBlockIndex(name));
        $scope.$apply();
    }

    function addBlock(event, ui) {
        var blockID = ui.helper.attr('id');
        var newBlock;
        switch(blockID){
            case 'step':
                newBlock = new Step();
                break;
            case 'integrator':
                newBlock = new Integrator();
                break;
            case 'transferFcn':
                newBlock = new TransferFcn();
                break;
            case 'pid':
                newBlock = new Pid();
                break;
            case 'scope':
                newBlock = new Scope();
                break;
        }

        addBlockToBlocks(newBlock);
        $scope.$apply();
        newBlock.fitBlock(ui);
        $scope.$apply();
        setContextMenu(newBlock);

        function addBlockToBlocks(newBlock) {
            checkNameOfBlock();
            $scope.blocks.push(newBlock);

            function checkNameOfBlock() {
                var theSameTypeBlock =  _.filter($scope.blocks, function (block) {
                    return block.type === newBlock.type;
                });
                if(theSameTypeBlock.length > 0)
                    newBlock.name = newBlock.type + theSameTypeBlock.length;
            }
        }

        function setContextMenu(newBlock) {
            $('#'+newBlock.name).contextPopup({
                items: [
                    {label:'Rotate left',     icon:'resources/contextMenu/rotateLeft.png',             action:function() {return newBlock.rotateLeft()}},
                    {label:'Rotate right',    icon:'resources/contextMenu/rotateRight.png',            action:function() {return newBlock.rotateRight()}},
                    null, // divider
                    {label:'Edit',           icon:'resources/contextMenu/edit.png',         action:function() {newBlock.editParameters()}},
                    {label:'Delete',         icon:'resources/contextMenu/delete.png',         action:function() {partial(deleteBlock, newBlock.name)}}
                ]
            });
        }
    }

    $rootScope.$on('addedBlock', addBlock);

}