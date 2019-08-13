$(document).ready(function () {
  // Get the modal
  // let modal = document.getElementById("myModal");

  // // Get the image and insert it inside the modal - use its "alt" text as a caption
  // let img = document.getElementById("myImg");
  // let modalImg = document.getElementById("img01");
  // let captionText = document.getElementById("caption");
  // img.onclick = function(){
  //   modal.style.display = "block";
  //   modalImg.src = this.src;
  //   captionText.innerHTML = this.alt;
  // }

  // // Get the <span> element that closes the modal
  // let span = document.getElementsByClassName("close")[0];

  // // When the user clicks on <span> (x), close the modal
  // span.onclick = function() { 
  //   modal.style.display = "none";
  // }

  $(".myImg").off("click").on("click" ,function(){
    let dataImgId = $(this).data("img-id");
    let getImageId = dataImgId.split("-")[1];
    $(`#myModal-${getImageId}`).css("display" , "block");
    $(`#myModal-${getImageId}`).find("img").attr("src" , $(this).attr("src"));
    $(`#caption-${getImageId}`).text($(this).attr(alt));
    
  })
  $(`.modal`).not($("img")).on("click" , function(e){
    e.stopPropagation();
   $(this).css("display" , "none");
  })
});

