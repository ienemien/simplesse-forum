$(document).ready(function() {
	
	//function to rotate topicarrow
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
	
	//function for adding new post
	var addpost = function(topic) {
        $(topic).on("submit", ".post-form", function() {
            if($('#message', topic).val().length > 0){
                
                //Set variables:
                var message = $('#message', topic).val();
                var email = $('#mailadd').text();
                var topicid = $('#topicid', topic).val();
                var username = $('#username').text();
    
                // Create an object for the form data:
                var data = new Object();
                data.message = message;
                data.email = email;
                data.topicid = topicid;
                
                // Create an object of Ajax options:
                var options = new Object();
    
                // Establish each setting:
                options.data = data;
                options.dataType = 'text';
                options.type = 'get';
                options.success = function(response) {
                    
                    //Decode JSON data:
                    var info = JSON.parse(response);
                    
                    // Worked:
                    if (info['result'] == 'CORRECT') {
                        
                        //get post_id
                        var post_id = info['post_id'];
                       
                        //get date and time
                        var date = info['date_posted'];
                        
                        //add new post
                        $('.new-post', topic).after('<div class="post row"><div class="user-info"><img class="user-pic" src="img/user.png" alt="userpic" /><ul><li><img class="user-icn" src="img/user-icn.png" alt="user icon" />' + username + '</li><li><a id="postmail" href="mailto:' + email + '"><img class="user-icn" src="img/message-icn.png" alt="user icon" /></a></li></ul></div><h4 class="post-header">Sent on ' + date + '</h4><div class="post-head"><form class="delete-post-form"><input type="hidden" id="postid" name="postid" value="' + post_id + '"><input class="submit-btn" type="submit" value="Delete" /></form><input id="edit-post-btn" type="submit" class="submit-btn" value="Edit" /><div class="edit-post"><form class="edit-post-form"><textarea id="newmessage" name="newmessage" cols="50" rows="10"></textarea><input type="hidden" id="postid" name="postid" value="' + post_id +'"><input class="submit-btn" type="submit" value="Save" /></form></div><span class="edit-message-result"></span></div><div class="post-content"><hr /><p class="post-text">' + message + '</p></div></div>');
						
						//add function to delete newly added post
						$('.post').each(function() {
							
							//store current context
							var thispost = $(this);
							
							//hide edit message form
							$('.edit-post', this).hide();
							
							//call function to delete post:
							deletePost(this);
							
							//show edit message form when clicking edit btn
							$('#edit-post-btn', $(this)).click(function() {
								$('.edit-post', topic).show();
							});
							
							//add edit button functionality
							editPost(this);
    					}); //end of applying delete function to each post
                        
                        //show success message
                        $('.post-results', topic).text('Your message has been posted!');
                        $('.post-results', topic).addClass('success');
                        
                    } else if (info['result'] == 'INCORRECT') {
                        $('#post-results', topic).text('Could not post your message, please try again!');
                        $('#post-results', topic).addClass('error');
                    } else if (info['result'] == 'INCOMPLETE') {
                        $('#post-results', topic).text('Please enter all fields!');
                        $('#post-results', topic).addClass('error');
                    } else if (info['result'] == 'UNKNOWN_USER') {					
                        $('#post-results', topic).text('Please log in first!');
                        $('#post-results', topic).addClass('error');
                    } else {
                        $('#post-results', topic).text('Something went wrong, please try again!');
                        $('#post-results', topic).addClass('error');
                    }
                }
                options.url = 'newpost.php';
    
                // Perform the request:
                $.ajax(options);
            }
            // Return false to prevent an actual form submission:
            return false;
        });//end of new post form submission
    }//end of function for making new post
	
	//Create function for handling delete button:
	var deletePost = function(post){
		$(post).on("submit", ".delete-post-form", function() {
            
            //set variables
                var postid = $('#postid', post).val();
                var email = $('#mailadd').text();

                // Create an object for the form data:
                var data = new Object();
                data.postid = postid;
                data.email = email;
                
                // Create an object of Ajax options:
                var options = new Object();
    
                // Establish each setting:
                options.data = data;
                options.dataType = 'text';
                options.type = 'get';
                options.success = function(response) {
                    
                    // Worked:
                    if (response == 'CORRECT') {
                        //replace post with success message
                        $(post).replaceWith("<p id='delete-success' class='success'>Your message has been deleted.</p>");
                        
                    } else if (response == 'INCORRECT') {
                        $('#post-results').text('Something went wrong, please try again!');
                        $('#post-results').addClass('error');
                    } else if (response == 'UNKNOWN_USER') {					
                        $('#post-results').text('You are not allowed to delete this post!');
                        $('#post-results').addClass('error');
                    } else {
                        $('#post-results').text('Something went wrong, please try again!');
                        $('#post-results').addClass('error');
                    }
                }
                options.url = 'deletepost.php';
    
                // Perform the request:
                $.ajax(options);
            
            // Return false to prevent an actual form submission:
            return false;
        });
	}
	
	//create function for handling edit post button
	var editPost = function(post) {
		$(post).on("submit", ".edit-post-form", function () {
            
            //set variables
			var postid = $('#postid', post).val();
            var email = $('#mailadd').text();
			var newmessage = $('#newmessage', post).val();
			
			// Create an object for the form data:
			var data = new Object();
			data.postid = postid;
			data.email = email;
			data.newmessage = newmessage;
			
			// Create an object of Ajax options:
			var options = new Object();

			// Establish each setting:
			options.data = data;
			options.dataType = 'text';
			options.type = 'get';
			options.success = function(response) {

				//show messages
				if (response == 'CORRECT') {
	
					// Hide the form:
					$('.edit-post').hide();
					
					//replace old message with new one
					$('.post-text', post).text(newmessage);
					
					//show success message
					$('.edit-message-result', post).text('Your message has been updated!');
					$('.edit-message-result', post).addClass('success');
					
				} else if (response == 'INCORRECT') {
					$('.edit-message-result', post).text('Could not edit message, please try again!');
					$('.edit-message-result', post).addClass('error');
				} else if (response == 'INCOMPLETE') {
					$('.edit-message-result', post).text('Please enter all fields!');
					$('.edit-message-result', post).addClass('error');
				} else {
					$('.edit-message-result', post).text('An unknown error occured, please try again later!');
					$('.edit-message-result', post).addClass('error');
				}
			}
			options.url = 'editpost.php';
    
			// Perform the request:
			$.ajax(options);
		
			// Return false to prevent an actual form submission:
			return false;
        });
	}
	
	//function for deleting a topic subject
	var deletetopic = function(topic) {
		$(topic).on("click", "#delete-topic", function() {
			
			//set variables
			var topicid = $('#topicid', topic).val();
			var email = $('#mailadd').text();

			// Create an object for the form data:
			var data = new Object();
			data.topicid = topicid;
			data.email = email;
			
			// Create an object of Ajax options:
			var options = new Object();

			// Establish each setting:
			options.data = data;
			options.dataType = 'text';
			options.type = 'get';
			options.success = function(response) {
				
				// Worked:
				if (response == 'CORRECT') {
					//replace post with success message
					$(topic).replaceWith("<p id='delete-success' class='success'>Your topic has been deleted.</p>");
					
				} else if (response == 'INCORRECT') {
					$('#post-results', topic).text('Something went wrong, please try again!');
					$('#post-results', topic).addClass('error');
				} else if (response == 'UNKNOWN_USER') {					
					$('#post-results', topic).text('You are not allowed to delete this topic!');
					$('#post-results', topic).addClass('error');
				} else {
					$('#post-results', topic).text('Something went wrong, please try again!');
					$('#post-results', topic).addClass('error');
				}
			}
			options.url = 'deletetopic.php';

			// Perform the request:
			$.ajax(options);
		
		// Return false to prevent an actual form submission:
		return false;
		});
	}//end of function for deleting topic
	
	
	//hide on opening of page
    //hide logout button
    $('#logout').hide();
    
    //hide content
    $('#content').hide();
    $('#show-user').hide();
    $('#edit-user').hide();
    $('#register').hide();

	//hide edit post form
	$('.edit-post').hide();
	
	//hide new topic form
	$('.new-topic').hide();

    //show registration form when clicking button
    $('#register-btn').click(function() {
        $('#login').hide();
        $('#register-btn').hide();
        $('#footer').height(200);
        $('#register').show();
        $('#register-form').show();
    });
    
    //handle registration form
    $('#register-form').submit(function() {
        
        //validate email (create functions to do this)
        //validate passfields
        //validate username
        
        if($('#regpass1').val() == $('#regpass2').val()){
            
            //set the variables
            var newname = $('#regname').val();
            var newmail = $('#regmail').val();
            var newpass = $('#regpass1').val();
        
            // Create an object for the form data:
			var data = new Object();
            data.newname = newname;
            data.newmail = newmail;
            data.newpass = newpass;
			
			// Create an object of Ajax options:
			var options = new Object();

			// Establish each setting:
			options.data = data;
			options.dataType = 'text';
			options.type = 'get';
			options.success = function(response) {
				
                //decode json response
                var info = JSON.parse(response);
                
				// Worked:
				if (info['result'] == 'CORRECT') {
	
					// Hide the form:
					$('#register').hide();
                    $('#register-form').hide();
                    $('#footer').height(100);
                    
                    //set user info variables
                    var username = info['newname'];
                    var email = info['newmail'];
                    
                    //show success message
                    $('#edit-success').text('Thank you ' + username + ' for registering! You will receive an email on ' + email + ' with a link to activate your account.');
					$('#edit-success').addClass('success');
				} else if (info['result'] == 'INCORRECT') {
					$('#reg-results').text('Could not register, please try again later!');
					$('#reg-results').addClass('error');
				} else if (info['result'] == 'INCOMPLETE') {
					$('#reg-results').text('Please enter all fields!');
					$('#reg-results').addClass('error');
				} else if (info['result'] == 'INVALID_EMAIL') {					
					$('#reg-results').text('Please provide a valid email address!');
					$('#reg-results').addClass('error');
                } else if (info['result'] == 'INVALID_USER') {					
					$('#reg-results').text('Please provide a valid username!');
					$('#reg-results').addClass('error');
                } else if (info['result'] == 'INVALID_PASS') {					
					$('#reg-results').text('Please provide a valid password!');
					$('#reg-results').addClass('error');
				} else if (info['result'] == 'NOT_UNIQUE') {
                    $('#reg-results').text('Email Address is already registered!');
					$('#reg-results').addClass('error');
                } else {
                    $('#reg-results').text('An unknown error occured, please try again later!');
					$('#reg-results').addClass('error');
                }
			} // End of success.
			options.url = 'register.php';

			// Perform the request:
			$.ajax(options);
		
		} else { 
            $('#reg-results').text('Passwords do not match!');
            $('#reg-results').addClass('error');
        } // End of pass1 and pass2 IF
		
		// Return false to prevent an actual form submission:
		return false;
        
    });//end of registration form
    
	// handle login form
	$('#login').submit(function() {
		
		// Initialize variables:
		var email, password;
		
		// Validate the email address:
		if ($('#email').val().length >= 6) {
			
			// Get the email address:
			email = $('#email').val();
			$('#email').removeClass('error').addClass('success');
		} else { // Invalid email address!
			$('#email').removeClass('success').addClass('error');
			$('#results').text('Please enter your email address!');
            $('#result-bar').addClass('error');
		}
		
		// Validate the password:
		if ($('#password').val().length > 0) {
			password = $('#password').val();
			$('#password').removeClass('error').addClass('success');
		} else {
			$('#password').addClass('error');
            $('#result-bar').addClass('error');
			$('#results').text('Please enter your password!');
		}
				
		// If appropriate, perform the Ajax request:
		if (email && password) {
	
			// Create an object for the form data:
			var data = new Object();
			data.email = email;
			data.password = password;
			
			// Create an object of Ajax options:
			var options = new Object();

			// Establish each setting:
			options.data = data;
			options.dataType = 'text';
			options.type = 'get';
			options.success = function(response) {
				
                //decode json response
                var info = JSON.parse(response);
                
				// Worked:
				if (info['result'] == 'CORRECT') {
	
					// Hide the form:
					$('#login').hide();
                    
                    //show logout button:
                    $('#logout').show();
                    
                    //show content and footer
                    $('#content').slideDown();
                    $('#footer').slideDown();
                    $('#show-user').show();
                    $('#edit-user').hide();
                    $('#edit-user-form').hide();
                    $('#register-btn').hide();
	
					// Show a welcome message
                    $('#result-bar').show();
					$('#result-bar').removeClass('error').addClass('success');
                    $('#results').text('You are now logged in!');
                    
                    //set user info variables
                    var username = info['username'];
                    var email = info['email'];
					
                    //update user info with the info from php
                    $('#username').text(username);
                    $('#mailadd').text(email);
					
					//show delete and edit buttons for this user
					$('.post').each(function() {
						
						//store current context
						var thispost = $(this);
						
						//store email adress from post and from current user
						var str = $('#postmail', $(this)).attr("href");
						var postMail = str.substring(7);
			
						//show buttons for posts of current user
						if(email !== postMail){
							$('.post-head', $(this)).hide();
						}//end of email IF
						
						//add delete button functionality
						deletePost(this);
						
						//show edit message form when clicking edit btn
						$('#edit-post-btn', $(this)).click(function() {
							$('.edit-post', thispost).show();
						});
						
						//add edit button functionality
						editPost(this);
					});
				} else if (info['result'] == 'INCORRECT') {
					$('#results').text('Invalid email or password');
					$('#results').addClass('error');
				} else if (info['result'] == 'INCOMPLETE') {
					$('#results').text('Please provide an email address and a password!');
					$('#results').addClass('error');
				} else if (info['result'] == 'INVALID_EMAIL') {					
					$('#results').text('Please provide your email address!');
					$('#results').addClass('error');
				}
				
			}; // End of success.
			options.url = 'login.php';

			// Perform the request:
			$.ajax(options);
		
		} // End of email && password IF.
		
		// Return false to prevent an actual form submission:
		return false;
		
	}); // End of login submission
    
    // Log out function
    $('#logout').submit(function() {
        
        //hide content
        $('#content').hide();
        $('#show-user').hide();
        
        //hide logout button
        $('#logout').hide();
        
        //show login form
        $('#login').show();
        $('#register-btn').show();
        
        //show loggedout message
        $('#results').addClass('success').text('You are now logged out!');
        
        // Return false to prevent an actual form submission:
		return false;
    }); //end of logout function
    
    //show edit user info
    $('#edit-user-btn').click(function() {
        
        //hide current user info
        $('#show-user').hide();
        
        //show edit user info form
        $('#edit-user').show();
        $('#edit-user-form').show();
        $('#footer').height(300);
    });
    
    //edit user info form: add validations!!
    $('#edit-user-form').submit(function() {
        
        //check if both passwords are the same
        if($('#pass1').val() == $('#pass2').val()){
            
            //set the variables
            var curname = $('#username').text();
            var curmail = $('#mailadd').text();
            var newname = $('#newname').val();
            var newmail = $('#newmail').val();
            var newpass = $('#pass1').val();
            
            // Create an object for the form data:
			var data = new Object();
            data.curname = curname;
			data.curmail = curmail;
            data.newname = newname;
            data.newmail = newmail;
            data.newpass = newpass;
			
			// Create an object of Ajax options:
			var options = new Object();

			// Establish each setting:
			options.data = data;
			options.dataType = 'text';
			options.type = 'get';
			options.success = function(response) {
				
                //decode json response
                var info = JSON.parse(response);
                
				// Worked:
				if (info['result'] == 'CORRECT') {
	
					// Hide the form:
					$('#edit-user').hide();
                    $('#edit-user-form').hide();
                    $('#footer').height(100);
                    
                    //show user info
                    $('#show-user').show();
                    
                    //set user info variables
                    var username = newname;
                    var email = newmail;
					
                    //update user info with the new info
                    $('#username').text(username);
                    $('#mailadd').text(email);
                    
                    //show success message
                    $('#edit-success').text('User info updated!');
					$('#edit-success').addClass('success');
                    
				} else if (info['result'] == 'INCORRECT') {
					$('#edit-results').text('Could not change user info, try again!');
					$('#edit-results').addClass('error');
				} else if (info['result'] == 'INCOMPLETE') {
					$('#edit-results').text('Please enter all fields!');
					$('#edit-results').addClass('error');
				} else if (info['result'] == 'INVALID_EMAIL') {					
					$('#edit-results').text('Please provide a valid email address!');
					$('#edit-results').addClass('error');
				} else {
                    $('#edit-results').text('An unknown error occured, please try again later!');
					$('#edit-results').addClass('error');
                }
			} // End of success.
			options.url = 'edituser.php';

			// Perform the request:
			$.ajax(options);
		
		} else { 
            $('#edit-results').text('Passwords do not match!');
            $('#edit-results').addClass('error');
        } // End of pass1 and pass2 IF
		
		// Return false to prevent an actual form submission:
		return false;
		
	}); // End of form submission.
	
	//add function to add post to all topics + function to delete topic
	$('.topic-subject').each(function() {
		deletetopic(this);
		addpost(this);
	});
	
	//open new topic field when clicking topic icon
	$('.forum-subject').each(function() {
		//store current context
		var thisforum = $(this);
		
		//show new topic form when clicking topic button
		$('#new-topic-btn', $(this)).click(function() {
			$('.new-topic', thisforum).slideToggle();
		});
		
		//handle new topic form
        $('.topic-form', $(this)).submit(function() {
            if($('#topic-subject', $(this)).val().length > 0){
                
                //Set variables:
				var subject = $('#topic-subject', $(this)).val();
                var email = $('#mailadd').text();
                var forumid = $('#forumid', $(this)).val();
                var username = $('#username').text();

                // Create an object for the form data:
                var data = new Object();
				data.email = email;
				data.subject = subject;
                data.forumid = forumid;
                
                // Create an object of Ajax options:
                var options = new Object();
    
                // Establish each setting:
                options.data = data;
                options.dataType = 'text';
                options.type = 'get';
                options.success = function(response) {
                    
                    //Decode JSON data:
                    var info = JSON.parse(response);
                    
                    // Worked:
                    if (info['result'] == 'CORRECT') {
                        
                        //get post_id
                        var topicid = info['topic_id'];

                        //add new topic to list
                        $('.new-topic', thisforum).after('<section id="newest" class="topic-subject"><div class="topic-bar"><div class="topic-info-left"><img class="topic-icn topic-arrow" src="img/topic-arrow.png" alt="new message" />' + subject + '</div><div class="topic-info-right"><img class="topic-icn" src="img/message-icn.png" alt ="message icon" />0<img id="delete-topic" class="topic-icn" src="img/delete-btn.png" alt ="message icon" /></div></div><div class="posts-container"><div class="new-post"><form class="post-form"><textarea id="message" name="message" cols="80" rows="10"></textarea><input type="hidden" id="topicid" name="topicid" value="' + topicid + '"><input class="submit-btn" type="submit" value="Submit" /><span class="post-results"></span></form></div>');
						$('#newest', thisforum).slideDown(300);
						$(thisforum).find(".topic-bar").slideDown(300);
						$(thisforum).find(".topic-info-left").slideDown(300);
            			$(thisforum).find(".topic-info-right").slideDown(300);
						
						//plus functionality to rotate arrow
						$(".topic-arrow", "#newest").data("rot", 0).click(function() {
							rotateArrow(this);
							$('.posts-container', '#newest').slideToggle(300);
						});
						
						//add functionality to add message or delete topic after creating it
						$('.topic-subject', thisforum).each(function() {
							deletetopic(this);
							addpost(this);
						});
						
						//hide new topic form
						$('.new-topic', thisforum).slideUp();
						
                        //show success message
                        $('.results', thisforum).text('Your message has been posted!');
                        $('.results', thisforum).addClass('success');
                        
                    } else if (info['result'] == 'INCORRECT') {
                        $('.results', thisforum).text('Something went wrong, please try again!');
                        $('.results', thisforum).addClass('error');
                    } else if (info['result'] == 'INCOMPLETE') {
                        $('.results', thisforum).text('Please enter all fields!');
                        $('.results', thisforum).addClass('error');
                    } else if (info['result'] == 'UNKNOWN_USER') {					
                        $('.results', thisforum).text('User not known, please log in first!');
                        $('.results', thisforum).addClass('error');
                    } else {
                        $('.results', thisforum).text('Something went wrong, please try again!');
                        $('.results', thisforum).addClass('error');
                    }
                }
                options.url = 'newtopic.php';
    
                // Perform the request:
                $.ajax(options);
            } else {
				$('.results', thisforum).text('Please enter all fields!');
                $('.results', thisforum).addClass('error');
			}
            // Return false to prevent an actual form submission:
            return false;
        });//end of new topic form submission
    });//end of applying functionality to each new topic form

}); // End of document ready.