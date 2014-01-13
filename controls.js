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
   * Split array to arrays by given property.
   *
   * @param {Function} cb Function returns property.
   * @returns {Array} Array of arrays.
   */
  Array.prototype.splitByProperty = function(cb){
    var hash = {};
    var property;
    this.forEach(function(item){
      property = cb(item)
      hash[property]=hash[property] || [];
      hash[property].push(item);
    });
    var key;
    var result = [];
    for(key in hash){
      result.push(hash[key]);
    }
    return result;
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
   * Add files to playlist
   *
   * @param {object} el HTML input element
   */
  self.addFiles = function(el){
    window.URL = window.URL || window.webkitURL;
    playlist.addFiles(
        [].slice.call(el.files).
        splitByProperty(function(file){
          return file.webkitRelativePath.split('/').slice(0,-1).join('/'); //remove file name from the path
        }).
        map(function(directory){
          return directory.sort(function(file1,file2){
              return file1.name.localeCompare(file2.name);
          });
        }).
        flatten().
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
      return $(div).index(); }));
  }

  /**
   * Run when document loaded.
   *
   * @param {object} audio HTML5 <audio> element.
   */
  self.setup = function(audio){
    self.audio = audio;
    self.audio.addEventListener('ended',function(){controls.next()}, false);

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