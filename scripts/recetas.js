// Description:
//   Trae recetas de recetasgratis.net
//
//  Dependencies:
//    cheerio
//    string
//
// Commands:
//   hubot receta <ingrediente>
//
// Author:
//   @jorgeepunan

var cheerio = require('cheerio');
var S       = require('string');

module.exports = function(robot) {
  robot.respond(/(receta|recetas) (.*)/i, function(msg) {

    var busqueda = msg.match[2];
    var domain = 'http://www.recetasgratis.net/busqueda';
    var url = domain + '?q=' + busqueda.split(' ').join('+');

    msg.robot.http(url).get()(function(err, res, body) {

      if (err) {
        robot.emit('error', err);
      } else {
        var $ = cheerio.load(body);
        var resultados  = [];
        var resNum      = $('.titulo.titulo--search').text();

        $('.resultado').each(function() {
          var title = $(this).find('.titulo.titulo--resultado').text();
          var link  = $(this).find('.titulo.titulo--resultado').attr('href');

          resultados.push(`<${link}|${title}>`);
        });

        if(resNum.length) {
          var limiteResultados = (resultados.length > 4) ? 3 : resultados.length;
          const resetas = resultados.slice(0, limiteResultados).map((v, i) => `${i + 1}: ${v}`).join('\n');
          const more = resultados.length > limiteResultados ? `\n<${url}|Ver más resultados>` : '';
          msg.send(`${resNum}\n${resetas}${more}`);
        } else {
          msg.send('No se han encontrado resultados sobre '+ busqueda + '. Intenta con otro ingrediente.');
        }

      }

    });

  });
};