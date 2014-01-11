var controls = (function (){
  var self = {};
  var playlist;
  /**
   * Set HTML player to use.
   *
   * @param {object} audio HTML5 <audio> element.
   */
  self.setAudio = function(audio){
    self.audio = audio;
    self.audio.addEventListener('ended',function(){controls.next()}, false);
  }

  self.setPlaylist = function(pl){
    playlist=pl;
  }

  self.play = function(){
    if (!self.audio.paused){
      self.audio.currentTime = 0;
    }
    self.audio.play();
  }

  self.pause = function(){
    self.audio.pause();
  }

  self.stop = function(){
    self.audio.pause();
    self.audio.currentTime = 0;
  }
  self.next = function(){
    playlist.next();
    self.audio.src = playlist.getCurrentFile().src;
    self.play();
  }

  self.previous = function(){
    playlist.previous();
    self.audio.src = playlist.getCurrentFile().src;
    self.play();
  }

  var file_to_hash = function(file){
    var result = {};
    result['name'] = file.name;
    result['src'] = window.URL.createObjectURL(file);
    id3(file, function(err,tags){
      result['tags']=tags;
    });
    return result;
  }

  /**
   * Add files to playlist
   *
   * @param {object} el HTML input element
   */
  self.addFiles = function(el){
    window.URL = window.URL || window.webkitURL;
    playlist.addFiles(
        [].slice.call(el.files).
        filter(function(file){
            return file.type.split('/')[0] == 'audio';
        }).                
        map(file_to_hash)
    );
    el.value = '';
  }

  self.removeFiles = function(){
    playlist.removeFiles($('#playlist > .ui-selected').
      toArray().
      map(function(div){
      return $(div).index() }));
  }

  /**
   * Run when document loaded.
   *
   * @param {object} audio HTML5 <audio> element.
   */
  self.setup = function(audio){
    self.audio = audio;

    $(document).keypress(function(e){
      if(e.charCode==32){
        if(self.audio.paused){
          self.play();
        } else {
          self.pause();
        }
      }
    });

    $(self.audio).bind('mousewheel',function(e){
      var deltaY = e.originalEvent.deltaY;
      if(deltaY<0){audio.volume+=0.05;}
      if(deltaY>0){audio.volume-=0.05;}
    })
  }
  return self;
}());