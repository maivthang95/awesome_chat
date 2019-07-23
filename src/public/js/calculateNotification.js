function increaseNotification(className){
  let currentValue = +$(`.${className}`).text();
  currentValue++;
  if(currentValue===0){
    $(`.${className}`).css("display" , "none").html("");
  }else{
    $(`.${className}`).css("display" , "block").html(`${currentValue}`)
  }
}
function decreaseNotification(className){
  let currentValue = +$(`.${className}`).text();
  currentValue--;
  if(currentValue===0){
    $(`.${className}`).css("display" , "none").html("");
  }else{
    $(`.${className}`).css("display" , "block").html(`${currentValue}`)
  }
}