var playlist = (function(){
  var self = {};
  var current = -1;

  self.length = 0;

  /**
   * @param {number} previous Id of previous song.
   * @param {number} next Id of next song.
   */
  self.onSongChanged = function(previous, next){};

  /**
   * @param {Array} files Array of files.
   */
  self.onFilesAdded = function(files){};

  /**
   * @param {Array} ids Ids of removed songs.
   */
  self.onFilesRemoved = function(ids){};

  self.getCurrentFile = function(){
    return self[current];
  }

  self.setCurrentFile = function(i){
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
   * Add files to playlist.
   *
   * @param {array} files Array of files.
   */
  self.addFiles = function(files){
    files.forEach(function(file){
      [].push.call(self,file);
    });
    if(current === -1){
      current = 0;
    }
    self.onFilesAdded(files);
  }

  var spaceship = function(a,b){ // a <=> b
    return a-b;
  }
  /**
   * Remove files from playlist.
   *
   * @param {array} ids Array of files' ids.
   */
  self.removeFiles = function(ids){
    ids.sort(spaceship).reverse().forEach(function(id){
      (window.URL || window.webkitURL).revokeObjectURL(self[id].src);
      [].splice.call(self,id,1);
    });
    self.onFilesRemoved(ids);
  }

  self.replaceFile = function(was,become){
    var file = [].splice.call(self,was,1)[0];
    [].splice.call(self,become,0,file);
    if(current == was){
      current = become;
    }
  }
  return self;
}());