//menu toggle 
var openMenu = function(e){
    e.preventDefault();
    e.stopPropagation();
    
    var btn = document.getElementById("primary").classList.toggle("open");
  }
  
  document.getElementById("toggle").addEventListener("click", function(e) {openMenu(e)});

