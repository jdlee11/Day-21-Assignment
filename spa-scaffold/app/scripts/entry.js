import $ from "jquery";
import Session from "./session";
import Message from "./message";
import moment from "moment";


let messageString = `
  <div class="message">
    <p class="handle"></p><p class="time"></p><p class="trash">X</p>
    <p class="message-text"></p>
  </div>
`;
let $messageContainer = $(".message-container");

function renderLogin(){
  $(".log-in-page").removeClass("hidden");
  let $loginButton = $(".login");
  $loginButton.on("click", evt => {
    $(".log-in-page").addClass("hidden");
    let $username = $(".username-input").val();
    let session = new Session($username);
    renderChat(session);
  });
}

function renderChat(session){
  $(".main-container").removeClass("hidden");
  let $messageInput = $(".user-input");
  $messageInput.keypress(function(evt){
    if (evt.keyCode === 13){
      evt.preventDefault();
      let newText = $messageInput.val();
      $messageInput.val("");
      let timestamp = moment().format("HH:mm A");
      let newMessage = new Message(timestamp, session.username, newText);
      newMessage.save();
      loadMessages(session);
    }
  });
  loadMessages(session);
  // every couple seconds, clear and load messages
  setInterval(function(){loadMessages(session);}, 2000);

  // $(".main-container").addClass("hidden"); // would be used for logout feature
}

function loadMessages(session){
  $.ajax({
    url: "http://tiny-za-server.herokuapp.com/collections/jlee-day-21",
    type: "GET",
    contentType: "application/json",
    success: function(response){
      $messageContainer.empty();
      if (response.length > 0){
        response.forEach(function(message){
          renderMessage(session, message);
        });
        $messageContainer.scrollTop($messageContainer[0].scrollHeight);
      }
    }
  });
}

function renderMessage(session, message){
  let $newMessageDiv = $(messageString);
  $newMessageDiv.children(".handle").text("@" + message.sender);
  $newMessageDiv.children(".time").text(message.timestamp);
  $newMessageDiv.children(".message-text").text(message.body);
  if (message.sender === session.username){
    $newMessageDiv.addClass("mine");
    $newMessageDiv.children(".trash").on("click", function(){
      Message.prototype.delete(message._id);
      loadMessages(session);
    });
  }
  $messageContainer.prepend($newMessageDiv);
}

$(document).ready(function(){
  renderLogin();
});
