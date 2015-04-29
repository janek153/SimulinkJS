window.onload = function() {
    hideToolsBtnDuringChangingTab();
};

$(document).ready(function(){
    $('.block').each(function(){
        $(this).draggable();
    });
});





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





