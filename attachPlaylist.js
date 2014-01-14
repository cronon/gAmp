/**
 * Attach playlist to view
 */
var attachPlaylist = function(playlist) {
  var was = 0;

  $('#playlist').sortable({ 
      handle: ".handle", 
      axis: 'y',
      start: function(e,ui){
          was = ui.item.index(); 
      },
      update: function(e,ui){
          playlist.replaceSong(was,ui.item.index());
      }
    }).
    selectable({ 
      filter: "li", 
      cancel: ".handle"
    });

  var onSongDblClick = function(e){
    var i = $(e.target).index();
    controls.stop();
    playlist.setCurrent(i);
    controls.audio.src = playlist.getCurrentSong().src;
    controls.play();
  }

  var onSongClick = function(e){
    $('#playlist > li').removeClass('ui-selected');
    $(this).addClass('ui-selected');
  }

  var onSongContext = function(e){
    var s = '';
    e.preventDefault();
    var song = playlist[$(e.target).index()];
    s+=song.name + '\n';
    if (song.tags){
      s+=song.tags.artist+' - '+song.tags.title+'\n';
      s+=(song.tags.album || '')+'\n';
      s+=(song.tags.year || '')+'\n';      
    }
    s+=(song.duration || '');
    alert(s);
  }

  playlist.onSongsAdded = function(songs){
    var s = '';
    songs.forEach(function(song){
      s = song.name;
      $('#playlist').append("<li>" + s + "</li>");
      $('li').last().addClass('not-highlited').
                    dblclick(onSongDblClick).
                    bind('contextmenu',onSongContext).
                    append("<span class='handle ui-icon ui-icon-carat-2-n-s'></span>").
                    append("<span class='duration'></span>");
    });
  }

  var scrollToSong = function(id){
    var position = $('li:eq('+id+')')[0].getBoundingClientRect()
    var visible = document.elementFromPoint(position.left,position.top);
    if(!visible || visible.nodeName.toLowerCase() != 'li'){
      $('#playlist_wrapper')[0].scrollTop=$('li:eq('+id+')')[0].offsetTop;
    }
  }

  /**
   * Convert seconds to hh:mm:ss or mm:ss if hh=='00'
   *
   * @param {Number} seconds
   * @return {String} String in hh:mm:ss or mm:ss format.
   */
  var secondsToTime = function(seconds){
    var prependZero = function(x){
      return String(x).length == 1 ? '0'+x : x
    }
    var h = Math.floor(seconds/3600);
    var m = Math.floor(seconds/60) - h*60;
    var s = Math.floor(seconds % 60);
    return result = (h==0 ? '' : prependZero(h)+':') + prependZero(m) + ':' + prependZero(s);
  }

  playlist.onSongChanged = function(prev,next){
    song = playlist[next];

    var s = '';
    if (song.tags && (song.tags['title'] || song.tags['artist'])){
        s += song.tags['artist'] + ' - ' + song.tags['title'];
    } else {
        s += song.name;
    }

    if(!song.duration){
      $(controls.audio).bind('canplay',function(e){
        song.duration = secondsToTime(controls.audio.duration);
        $('li:eq('+next+') > .duration').text(song.duration);
        $(controls.audio).unbind('canplay');
      });
    }
    
    $('li:eq('+prev+')').addClass('not-highlited').removeClass('highlited');
    $('li:eq('+next+')').addClass('highlited').removeClass('not-highlited').
        contents().first()[0].textContent=s;
    title = s+'\u2007\u2007';
    $('#current_song').text(s);
    scrollToSong(next);
  }

  playlist.onSongsRemoved = function(indexes){
    indexes.forEach(function(i){
      $('li:eq('+i+')').remove();
    });
  }
};