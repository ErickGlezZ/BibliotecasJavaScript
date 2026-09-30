$(document).ready(function(){
    $("#botonSaludo").click(function(){

        var nombre = $("#nombre").val();

        if (nombre == ""){
            $("#mensaje").text("Por favor, escribe tu nombre.");
            
        }else{
            $("#mensaje").text("Hola, " + nombre + "!");
        }
    })
})