import $ from "jquery";

function Message(timestamp, sender, body){
  this.timestamp = timestamp;
  this.sender = sender;
  this.body = body;
}

Message.prototype.save = function(){
  $.ajax({
      url: "http://tiny-za-server.herokuapp.com/collections/jlee-day-21",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(this),
      success: response => {
        this._id = response._id;
      }
    });
};

Message.prototype.delete = function(id){
  $.ajax({
    url: "http://tiny-za-server.herokuapp.com/collections/jlee-day-21/" + id,
    type: "DELETE",
    success: function(response){
    }
  });
};

export default Message;
