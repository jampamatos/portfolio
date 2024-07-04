import $ from 'jquery';
import 'jquery-ui/ui/widgets/resizable';

$(function() {
    console.log("Documento carregado.");
    console.log("jQuery versão:", $.fn.jquery); // Verifica a versão do jQuery
    console.log("jQuery UI está carregado?", !!$.ui); // Verifica se o jQuery UI está carregado
    
    $("#main-window").resizable({
    handles: 'n, e, s, w, ne, se, sw, nw', // Especifica que o redimensionamento pode acontecer de todos os lados e cantos
    minHeight: 150,
    minWidth: 200
  });

    // Verifica se o elemento existe antes de tentar torná-lo redimensionável
    if ($("#main-window").length) {
      console.log("Elemento '#main-window' encontrado.");
      $("#main-window").resizable({
        minHeight: 150,
        minWidth: 200,
        start: function(event, ui) {
          console.log("Redimensionamento iniciado.");
        },
        resize: function(event, ui) {
          console.log("Redimensionando... Tamanho atual: ", ui.size);
        },
        stop: function(event, ui) {
          console.log("Redimensionamento parado. Tamanho final: ", ui.size);
        }
      });
    } else {
      console.log("Elemento '#main-window' NÃO encontrado.");
    }
  });