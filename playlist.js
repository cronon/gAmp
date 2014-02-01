var playlist = (function(){
  var self = [];
  var current = -1;

  self.shuffle = false;
  self.repeat = false;

  /**
   * @param {number} previous Index of previous song.
   * @param {number} next Index of next song.
   */
  self.onSongChanged = function(previous, next){};

  /**
   * @param {Array} songs Array of songs.
   */
  self.onSongsAdded = function(songs){};

  /**
   * @param {Array} indexes of removed songs.
   */
  self.onSongsRemoved = function(indexes){};

  self.getCurrentSong = function(){
    return self[current];
  }

  self.setCurrent = function(i){
    var prev = current;
    current = i;
    self.onSongChanged(prev,current);
  }

  self.next = function(){
    var prev = current;
    if(!self.repeat){current+=1};
    if(self.shuffle){current = Math.floor(Math.random()*self.length % self.length);}
    if(current>=self.length){
      current -=self.length;
    }
    var next = current;
    self.onSongChanged(prev,next);
  }

  self.previous = function(){
    var prev = current;
    current-=1;
    if(current<0){
      current=self.length-1;
    }
    var next = current;
    self.onSongChanged(prev,next);
  }

  /**
   * Add songs to playlist.
   *
   * @param {array} songs Array of songs.
   */
  self.addSongs = function(songs){
    songs.forEach(function(song){
      self.push(song);
    });
    if(current === -1){
      current = 0;
    }
    self.onSongsAdded(songs);
  }

  var spaceship = function(a,b){ // a <=> b
    return a-b;
  }
  /**
   * Removes songs from playlist.
   *
   * @param {array} indexes Array of songs' indexes.
   */
  self.removeSongs = function(indexes){
    indexes.sort(spaceship).reverse().forEach(function(i){
      (window.URL || window.webkitURL).revokeObjectURL(self[i].src);
      self.splice(i,1);
    });
    self.onSongsRemoved(indexes);
  }

  self.replaceSong = function(was,become){
    var current_song = self.getCurrentSong();
    var song = self.splice(was,1)[0];
    self.splice(become,0,song);    
    current = self.indexOf(current_song);
  }
  return self;
}());