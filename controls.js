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
    $('#favicon')[0].href = 'images/play.png';
  }

  self.pause = function(){
    
    if(self.audio.paused){
      self.play();
    } else {
      self.audio.pause();
      $('#favicon')[0].href = 'images/pause.png';
    }
  }

  self.stop = function(){
    self.pause();
    self.audio.currentTime = 0;
  }

  self.next = function(){
    playlist.next();
    self.audio.src = playlist.getCurrentSong().src;
    self.play();
  }

  self.previous = function(){
    playlist.previous();
    self.audio.src = playlist.getCurrentSong().src;
    self.play();
  }

  var Song = function(file){
    this['name'] = file.name;
    this['src'] = window.URL.createObjectURL(file);
    id3(file, function(err,tags){
      this['tags']=tags;
    });
  }

  /**
   * Flattens a nested array.
   *
   * @returns {Array} Array flattened a single level
   */
  Array.prototype.flatten = function (){
    return this.reduce(function(a,b){
      if(a.concat){
        return a.concat(b)
      }else{
        return [a].concat(b)
      }
    });
  }

  /**
   * Sort files by path
   *
   * @param {Array} Array of files.
   * @return {Array} Array of files.
   */
  var sortByPath = function(files){
    return files.sort(function(file1,file2){
        return (file1.webkitRelativePath||file1.mozFullPath).
          localeCompare((file2.webkitRelativePath||file2.mozFullPath));
    });
  }

  /**
   * Add files to playlist
   *
   * @param {object} el HTML input element
   */
  self.addFiles = function(el){
    el.click();
    el.onchange = function(){
    window.URL = window.URL || window.webkitURL;
    playlist.addSongs(
        sortByPath(
          [].slice.call(el.files)
        ).        
        filter(function(file){
          return ['audio/mpeg','audio/wave','audio/ogg','audio/mp3'].indexOf(file.type)+1;
        }).                
        map(function(f){return new Song(f)})
    );
    el.value = '';}
  }

  self.removeSongs = function(){
    playlist.removeSongs($('#playlist > .ui-selected').
      toArray().
      map(function(div){
      return $(div).index(); })
    );
  }

  /**
   * Run when document loaded.
   *
   * @param {object} audio HTML5 <audio> element.
   */
  self.setup = function(audio){
    self.audio = audio;
    self.audio.addEventListener('ended',function(){controls.next()}, false);

    $(document).keyup(function(e){
      console.log(e.keyCode)
      if(e.keyCode==32||e.keyCode==19){
        if(self.audio.paused){
          self.play();
        } else {
          self.pause();
        }
      }
      if(e.keyCode==8||e.keyCode==46){
        self.removeSongs();
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