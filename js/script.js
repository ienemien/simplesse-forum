$(document).ready(function() {
    
    //add rotation parameter to each arrow and set it to 0
    $(".forum-arrow").each(function(){
        $(this).data("rot", 0);
    });
    
    $(".topic-arrow").each(function(){
        $(this).data("rot", 0);
    });
    
    //function to rotate arrow
    var rotateArrow = function(item) {
        if ($(item).data("rot") === 0) {
            $(item).data("rot", 90);
        } else {
            $(item).data("rot", 0);
        }
        $(item).stop().animate(
            {rotation: $(item).data("rot")},
            {
                duration: 300,
                step: function(now, fx) {
                  $(item).css({"transform": "rotate("+now+"deg)"});
                }
            }
        );
    };
    
    //function to reset topic-arrows when closing forum-subject
    var resetArrow = function(item) {
        if ($(item).data("rot") === 90) {
            $(item).data("rot", 0);
        }
        $(item).stop().animate(
            {rotation: $(item).data("rot")},
            {
                duration: 300,
                step: function(now, fx) {
                  $(item).css({"transform": "rotate("+now+"deg)"});
                }
            }
        );
    };
    
    // loop through each forum-subject and add functionality
    $(".forum-subject").each(function(){
        var forumSubject = this;
        $(this).find(".forum-arrow").click(function() {
            rotateArrow(this);
            $(forumSubject).find(".topic-bar").slideToggle(300);
            $(forumSubject).find(".topic-info-left").slideToggle(300);
            $(forumSubject).find(".topic-info-right").slideToggle(300);
            $(forumSubject).find(".posts-container").slideUp(300);
            resetArrow($(forumSubject).find(".topic-arrow"));
        });
    });
    
    //loop through each topic subject and add animations
    $(".topic-subject").each(function() {
        var topicSubject = this;
        $(this).find(".topic-arrow").click(function() {
            rotateArrow(this);
            $(topicSubject).find(".posts-container").slideToggle(300);
        });
    });

}); //end of document ready function
    