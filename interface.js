// var interface = (function(){
//   var self = {};
//   return self;
// })();
var setup_interface = function(playlist) {
  var was = 0;

  $('#playlist').sortable({ 
      handle: ".handle", 
      axis: 'y',
      start: function(e,ui){
          was = ui.item.index(); 
      },
      update: function(e,ui){
          playlist.replaceFile(was,ui.item.index());
      }
    }).
    selectable({ 
      filter: "li", 
      cancel: ".handle"
    });

  var onSongDblClick = function(e){
    var id = $(e.target).index();
    controls.stop();
    playlist.setCurrentFile(id);
    controls.audio.src = playlist.getCurrentFile().src;
    controls.play();
  }

  var onSongClick = function(e){
    $('#playlist > li').removeClass('ui-selected');
    $(this).addClass('ui-selected');
  }

  playlist.onFilesAdded = function(files){
    var s = '';
    files.forEach(function(file){
      s = file.name;
      $('#playlist').append("<li>" + s + "</li>");
      $('li').last().addClass('not-highlited').
                    dblclick(onSongDblClick).
                    append("<span class='handle ui-icon ui-icon-carat-2-n-s'></span>");
    });
  }

  var scrollToSong = function(id){
    var position = $('li:eq('+id+')')[0].getBoundingClientRect()
    var visible = document.elementFromPoint(position.left,position.top);
    if(!visible || visible.nodeName.toLowerCase() != 'li'){
      $('#playlist_wrapper')[0].scrollTop=$('li:eq('+id+')')[0].offsetTop;
    }
  }

  playlist.onSongChanged = function(prev,next){
    file = playlist[next];

    var s = '';
    if (file.tags && file.tags['artist'] && file.tags['title']){
        s += file.tags['artist'] + ' - ' + file.tags['title'];
    } else {
        s += file.name;
    }
    $('li:eq('+prev+')').addClass('not-highlited').removeClass('highlited');
    $('li:eq('+next+')').addClass('highlited').removeClass('not-highlited').
        contents().first()[0].textContent=s;
    document.title = s;
    $('#current_song').text(s);
    scrollToSong(next);
  }

  playlist.onFilesRemoved = function(ids){
    ids.sort().reverse().forEach(function(id){
      $('li:eq('+id+')').remove();
    })
  }
};