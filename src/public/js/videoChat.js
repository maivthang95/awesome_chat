
function videoChat(divId){
  $(`#video-chat-${divId}`).unbind("click").on("click" , function(){
    let targetId = $(this).data("chat");
    let callerName = $("#navbar-username").text();
    let dataToEmit = {
      listenerId : targetId ,
      callerName :callerName
    }
    

    //step01 Caller : check user listener is online or not
   socket.emit("caller-check-listener-online-or-not" , dataToEmit);
  })
}

function playVideoStream(videoTargetId , stream){
  let video = document.getElementById(videoTargetId) ;
  video.srcObject = stream ; 
  video.onloadeddata = function(){
    video.play();
  }
}

function closeVideoStream(stream){
  return stream.getTracks().forEach( track => {
    track.stop();
  })
}


$(document).ready(function () {

  //step02 : 
  socket.on("server-send-listener-offline" , () => {
    alertify.notify("Người dùng hiện không trực tuyến" , "error" , 7);
  })

  let iceServerList = $("#ice-servers-list").val();
  iceServerList = JSON.parse(iceServerList);
  
  let getPeerId = "" ; 
  const peer = new Peer({
    key : "peerjs" , 
    host : "peerjs-server-trungquandev.herokuapp.com", 
    secure : true , 
    port : 443 , 
    debug : 0 ,
    config : { 'iceServers': iceServerList}
  }); 
 
  peer.on("open" , function(peerId){
    getPeerId = peerId ;
  })
  
  //step03 of listener
  socket.on("server-request-peer-id-of-listener" , response => {
    let listenerName = $("#navbar-username").text();
    let dataToEmit = {
      callerId : response.callerId  ,
      listenerId : response.listenerId ,
      callerName : response.callerName ,
      listenerPeerId : getPeerId ,
      listenerName : listenerName
    }
  
    //step 04 of listener
    socket.emit("listener-emit-peer-id-to-server" , dataToEmit);
  });
  
  let timerInterval;
  //step05 of caller
  socket.on("server-send-peer-id-of-listener-to-caller" , response => {
    let dataToEmit = {
      callerId : response.callerId  ,
      listenerId : response.listenerId ,
      callerName : response.callerName ,
      listenerPeerId : response.listenerPeerId ,
      listenerName : response.listenerName
    }

  //step06 of caller
    socket.emit("caller-request-call-to-server" , dataToEmit)

    Swal.fire({
      title: `Đang gọi cho &nbsp; <span style="color:#2ECC71;">${response.listenerName}</span> &nbsp;<i class="fa fa-volume-control-phone"></i> `,
      html : `
        Thời gian: <strong style="color:#d43f3a;"></strong> giây <br/><br/>
        <button id="btn-cancel-call" class="btn btn-danger">Hủy</button>
      `,
      backdrop : "rgba(85,85,85,0.4)",
      width : "52rem" , 
      allowOutsideClick : false ,
      showConfirmButton: false,
      timer: 30000,
      onBeforeOpen : () => {
        $("#btn-cancel-call").unbind("click").on("click" , function(){
          Swal.close();
          clearInterval(timerInterval);

          //step07
          socket.emit("caller-cancel-request-call-to-server" , dataToEmit) ;
        })
        if(Swal.getContent().querySelector !== null){
          Swal.showLoading() ;
          timerInterval = setInterval( () => {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft()/1000);
          }, 1000)
        }
        
      },
      onOpen : () => {
        //step12 of caller
        socket.on("server-send-reject-request-call-to-caller" , response => {
          Swal.close() ; 
          clearInterval(timerInterval);
          Swal.fire({
            type : "info" , 
            title : `<span style="color:#2ECC71;">${response.listenerName}</span> &nbsp; hiện tại không thể nghe máy`,
            backdrop : "rgba(85,85,85,0.4)" , 
            width : "52rem" ,
            allowOutsideClick : false ,
            confirmButtonColor : "#2ecc71",
            confirmButtonText : "Xác nhận"
          })
        })
      },
      onClose : () => {
        clearInterval(timerInterval);
      }
    })


  });

  //step08 of listener
  socket.on("server-send-request-call-to-listener" , response => {
    let dataToEmit = {
      callerId : response.callerId  ,
      listenerId : response.listenerId ,
      callerName : response.callerName ,
      listenerPeerId : response.listenerPeerId ,
      listenerName : response.listenerName
    }

    Swal.fire({
      title: `<span style="color:#2ECC71;">${response.callerName}</span> &nbsp; đang gọi cho bạn &nbsp; <i class="fa fa-volume-control-phone"></i> `,
      html : `
        Thời gian: <strong style="color:#d43f3a;"></strong> giây <br/><br/>
        <button id="btn-accept-call" class="btn btn-success">Chấp nhận</button>
        <button id="btn-reject-call" class="btn btn-danger">Hủy</button>
      `,
      backdrop : "rgba(85,85,85,0.4)",
      width : "52rem" , 
      allowOutsideClick : false ,
      showConfirmButton: false,
      timer: 30000,
      onBeforeOpen : () => {
        $("#btn-reject-call").unbind("click").on("click" , function(){
          Swal.close();
          clearInterval(timerInterval);
          //step10 of listener
          socket.emit("listener-reject-request-call-to-server" , dataToEmit) ;
        })
        $("#btn-accept-call").unbind("click").on("click" , function(){
          Swal.close();
          clearInterval(timerInterval);
          //step10 of listener
          socket.emit("listener-accept-request-call-to-server" , dataToEmit) ;
        })
        if(Swal.getContent().querySelector !== null){
          Swal.showLoading() ;
          timerInterval = setInterval( () => {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft()/1000);
          }, 1000)
        }
      },
      onOpen : () => {
        //step09 of listener
        socket.on("server-send-cancel-request-call-to-listener" , response => {
          Swal.close();
          clearInterval(timerInterval);
        })
       
      },
      onClose : () => {
        clearInterval(timerInterval);
      }
    })
  })
  //step13 of caller
  socket.on("server-send-accept-call-to-caller" , response => {
    Swal.close() ; 
    clearInterval(timerInterval);
    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
    getUserMedia({video: true, audio: true}, function(stream) {
      //show modal streaming
      $("#streamModal").modal({
        backdrop : "static" ,
        keyboard : true , 
        show : true 
      });
      //play myStream in local
      playVideoStream("local-stream" , stream );
      let call = peer.call(response.listenerPeerId, stream);

      //listen & play Stream of listener
      call.on("stream", function(remoteStream) {
        //play stream of listener
        playVideoStream("remote-stream" , remoteStream)  
      });

      //Close modal then remove stream
      $("#streamModal").on("hidden.bs.modal" , function(){
        closeVideoStream(stream) ;
        Swal.fire({
          type : "info" , 
          title : `Đã kết thúc cuộc gọi với &nbsp;<span style="color:#2ECC71;">${response.listenerName}</span> &nbsp;`,
          backdrop : "rgba(85,85,85,0.4)" , 
          width : "52rem" ,
          allowOutsideClick : false ,
          confirmButtonColor : "#2ecc71",
          confirmButtonText : "Xác nhận"
        })
      })
    }, function(err) {
     
      if(err.toString() === "NotAllowedError: Permission denied"){
        alertify.notify("Bạn đã tắt quyền truy cập vào định vị nghe gọi trên trình duyệt, vui lòng mở lại trong phần cài đặt trình duyệt" , "error" , 10);
      } 
      if(err.toString() === "NotFoundError: Requested device not found"){
        alertify.notify("Thiết bị của bạn không hỗ trợ tính năng nghe gọi" , "error" , 10);
      }
    });
  })
  //step14 of listener
  socket.on("server-send-accept-call-to-listener" , response => {
    Swal.close();
    clearInterval(timerInterval);
    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
    peer.on("call", function(call) {
      getUserMedia({video: true, audio: true}, function(stream) {

        $("#streamModal").modal({
          backdrop : "static" ,
          keyboard : true , 
          show : true 
        }); 

        playVideoStream("local-stream" , stream)

        call.answer(stream); // Answer the call with an A/V stream.
        call.on("stream", function(remoteStream) {
          playVideoStream("remote-stream" , remoteStream);
        });

        $("#streamModal").on("hidden.bs.modal" , function(){
          closeVideoStream(stream) ;
          Swal.fire({
            type : "info" , 
            title : `Đã kết thúc cuộc gọi với &nbsp;<span style="color:#2ECC71;">${response.callerName}</span> &nbsp;`,
            backdrop : "rgba(85,85,85,0.4)" , 
            width : "52rem" ,
            allowOutsideClick : false ,
            confirmButtonColor : "#2ecc71",
            confirmButtonText : "Xác nhận"
          })
        })
      }, function(err) {
        if(err.toString() === "NotAllowedError: Permission denied"){
        alertify.notify("Bạn đã tắt quyền truy cập vào định vị nghe gọi trên trình duyệt, vui lòng mở lại trong phần cài đặt trình duyệt" , "error" , 10);
        }
        if(err.toString() === "NotFoundError: Requested device not found"){
        alertify.notify("Thiết bị của bạn không hỗ trợ tính năng nghe gọi" , "error" , 10);
        }
        
      });
    });
  })
});