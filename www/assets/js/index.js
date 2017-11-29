(function(){
  
  var chat = {
    messageToSend: '',
    init: function() {
      this.cacheDOM();
      this.bindEvents();
      this.render();
    },
    cacheDOM: function() {
      this.$chatHistory = $('.chat-history');
      this.$button = $('button');
      this.$textarea = $('#message-to-send');
      this.$chatHistoryList =  this.$chatHistory.find('ul');
      this.$chatBubble = $("#chat-bubble");
      this.$closeChat = $(".close-chat");
      this.$chatContainer = $("#chat-container");
    },
    bindEvents: function() {
      this.$button.on('click', this.addMessage.bind(this));
      this.$chatBubble.on('click', this.toggleChatContainer.bind(this));
      this.$closeChat.on('click', this.toggleChatContainer.bind(this));
      this.$textarea.on('keyup', this.addMessageEnter.bind(this));
    },
    render: function() {
      this.scrollToBottom();
      if (this.messageToSend.trim() !== '') {
        var template = Handlebars.compile( $("#message-template").html());
        var context = { 
          messageOutput: this.messageToSend,
          time: this.getCurrentTime()
        };

        this.$chatHistoryList.append(template(context));
        this.scrollToBottom();
        this.$textarea.val('');
        
        // responses
        var templateResponse = Handlebars.compile( $("#message-response-template").html());
        var contextResponse = { 
          response: "",
          time: this.getCurrentTime()
        };
        $(".loading").show();
        $.ajax({
          type: "POST",
          url: "https://api.api.ai/v1/query?v=20150910",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          headers: {
              "Authorization": "Bearer 512e1408b0e54bfd9c20c7e8c71c57c2"
          },
          data: JSON.stringify({ query: this.messageToSend, lang: "es", sessionId: "123123" }),
          success: function(data) {
            setTimeout(function() {
              $(".loading").hide();
              contextResponse.response = data.result.fulfillment.speech
              chat.$chatHistoryList.append(templateResponse(contextResponse));
              chat.scrollToBottom();
            }, 1000)
          },
          error: function(error) {
              console.log(error)
          }
        });
        
      }
      
    },
    
    addMessage: function() {
      this.messageToSend = this.$textarea.val()
      this.render();         
    },
    addMessageEnter: function(event) {
        // enter was pressed
        if (event.keyCode === 13) {
          this.addMessage();
        }
    },
    scrollToBottom: function() {
       this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
    },
    getCurrentTime: function() {
      return new Date().toLocaleTimeString().
              replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    },
    toggleChatContainer: function(){
      this.$chatBubble.slideToggle( "slow" );
      this.$chatContainer.slideToggle( "slow" );
    }
    
  };
  
  chat.init();
  
})();