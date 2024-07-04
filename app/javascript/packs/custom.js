import $ from 'jquery';
import 'jquery-ui/ui/widgets/resizable';

$(function() {

    $("#main-window").resizable({
    handles: 'n, e, s, w, ne, se, sw, nw', // Especifica que o redimensionamento pode acontecer de todos os lados e cantos
  });

    // Verifica se o elemento existe antes de tentar torná-lo redimensionável
    if ($("#main-window").length) {
        $("#main-window").resizable({
            minHeight: 150,
            minWidth: 200,
        });
    }});