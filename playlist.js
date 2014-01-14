var playlist = (function(){
  var self = {};
  var current = -1;

  self.length = 0;

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
    current+=1;
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
      [].push.call(self,song);
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
      [].splice.call(self,i,1);
    });
    self.onSongsRemoved(indexes);
  }

  self.replaceSong = function(was,become){
    var file = [].splice.call(self,was,1)[0];
    [].splice.call(self,become,0,file);
    if(current == was){
      current = become;
    }
  }
  return self;
}());