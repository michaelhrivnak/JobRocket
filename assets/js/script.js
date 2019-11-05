// $(".jobs").click(function() {
//     window.location = $(this).data("location");
//     return false;
    
// });

$(document).ready(function(){
    $(".jobs").click(function(){
        $(".description").toggle("slide");
    });
});
