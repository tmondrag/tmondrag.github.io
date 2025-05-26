var config = {
  fontcolor: "#444444",
  bgcolor: ["#E0E0E0","#F5F5F5"],
  bordercolor: "black",
  plainName:"harmony",
  emName:"dodderidge",
  photoURL:"https://i471.photobucket.com/albums/rr74/Graclessally/Role%20Play/wiki/valesco/harmony.png",
  photoHeight:"200",
  songList:
    [
      {
        songTitle:"Good Day Sunshine",
        songArtist:"The Beatles",
        songURL:"https://www.youtube.com/watch?v=dHTPdbpogRE"
      },
      {
        songTitle:"Time After Time",
        songArtist:"Cyndi Lauper",
        songURL:"https://www.youtube.com/watch?v=hpvSFahB7n8"
      },
      {
        songTitle:"Little Wing",
        songArtist:"Jimi Hendrix",
        songURL:"https://www.youtube.com/watch?v=sqzZUJN-jfI"
      }
    ]
}

function removeSong(index) {
  removeElementByID("sfr-"+index);
  config['songList'].splice(index, 1);
  populateSonglistForm();
  populateSonglistPreview();
  populateHTML();
  populateJSONbox();
  populateCSVbox();
}

function addNewSong() {
  var lastInd = config["songList"].length - 1;
  var song = config["songList"][lastInd];
  var newSong = {
    songTitle:song["songTitle"],
    songArtist:song["songArtist"],
    songURL:song["songURL"]
  };
  config["songList"].push(newSong);
  addSongPreview(newSong, lastInd+1);
  addSongForm(newSong, lastInd+1);
  populateHTML();
  populateJSONbox();
  populateCSVbox();
}

function changePlainName() {
  var el = document.getElementById("inPlainName");
  config['plainName'] = el.value;
  document.getElementById("PPlainName").value = el.value;
  populateJSONbox();
  populateCSVbox();
  populatePreview();
  populateHTML();
}

function changePPlainName() {
  var el = document.getElementById("PPlainName");
  config['plainName'] = el.value;
  document.getElementById("inPlainName").value = el.value;
  populateJSONbox();
  populateCSVbox();
  populatePreview();
  populateHTML();
}

function changeEmName() {
  var el = document.getElementById("inEmName");
  config['emName'] = el.value;
  document.getElementById("PEmName").value = el.value;
  populateJSONbox();
  populateCSVbox();
  populatePreview();
  populateHTML();
}

function changePEmName() {
  var el = document.getElementById("PEmName");
  config['emName'] = el.value;
  document.getElementById("inEmName").value = el.value;
  populateJSONbox();
  populateCSVbox();
  populatePreview();
  populateHTML();
}

function changePhotoHeight() {
  var el = document.getElementById("inPhotoHeight");
  config['photoHeight'] = el.value;
  document.getElementById("PPhotoHeight").value = el.value;
  populateJSONbox();
  populateCSVbox();
  populatePreview();
  populateHTML();
}

function changePPhotoHeight() {
  var el = document.getElementById("PPhotoHeight");
  config['photoHeight'] = el.value;
  document.getElementById("inPhotoHeight").value = el.value;
  populateJSONbox();
  populateCSVbox();
  populatePreview();
  populateHTML();
}

function changePhotoURL() {
  var el = document.getElementById("inPhotoURL");
  config['photoURL'] = el.value;
  document.getElementById("PPhotoURL").value = el.value;
  populateJSONbox();
  populateCSVbox();
  populatePreview();
  populateHTML();
}

function changePPhotoURL() {
  var el = document.getElementById("PPhotoURL");
  config['photoURL'] = el.value;
  document.getElementById("inPhotoURL").value = el.value;
  populateJSONbox();
  populateCSVbox();
  populatePreview();
  populateHTML();
}

function changeSongTitle(index) {
  var el = document.getElementById("sft-input-"+index);
  config['songList'][index]['songTitle'] = el.value;
  populateJSONbox();
  populateCSVbox();
  populateSonglistPreview();
  populateHTML();
}

function changeSongArtist(index) {
  var el = document.getElementById("sfa-input-"+index);
  config['songList'][index]['songArtist'] = el.value;
  populateJSONbox();
  populateCSVbox();
  populateSonglistPreview();
  populateHTML();
}

function changeSongURL(index) {
  var el = document.getElementById("sfu-input-"+index);
  config['songList'][index]['songURL'] = el.value;
  populateJSONbox();
  populateCSVbox();
  populateSonglistPreview();
  populateHTML();
}

function addSongForm(song,index) {
  addElement("songlist_input_array", "div", "sfr-"+index, "");
  var el = document.getElementById("sfr-"+index);
  el.setAttribute("class", "row songForm");
  addElement("sfr-"+index, "div", "sft-"+index, "");
  var el = document.getElementById("sft-"+index);
  el.setAttribute("class", "col-sm-3");
  addElement("sfr-"+index, "div", "sfa-"+index, "");
  var el = document.getElementById("sfa-"+index);
  el.setAttribute("class", "col-sm-3");
  addElement("sfr-"+index, "div", "sfu-"+index, "");
  var el = document.getElementById("sfu-"+index);
  el.setAttribute("class", "col-sm-5");
  addElement("sfr-"+index, "div", "sfbd-"+index, "");
  var el = document.getElementById("sfbd-"+index);
  el.setAttribute("class", "col-sm-1");
  addElement("sft-"+index, "input", "sft-input-"+index, "");
  var el = document.getElementById("sft-input-"+index);
  el.setAttribute("type", "text");
  el.setAttribute("value", song['songTitle']);
  el.setAttribute("onchange", "changeSongTitle("+index+");");
  addElement("sfa-"+index, "input", "sfa-input-"+index, "");
  var el = document.getElementById("sfa-input-"+index);
  el.setAttribute("type", "text");
  el.setAttribute("value", song['songArtist']);
  el.setAttribute("onchange", "changeSongArtist("+index+");");
  addElement("sfu-"+index, "input", "sfu-input-"+index, "");
  var el = document.getElementById("sfu-input-"+index);
  el.setAttribute("type", "url");
  el.setAttribute("value", song['songURL']);
  el.setAttribute("class", "col-sm-12");
  el.setAttribute("onchange", "changeSongURL("+index+");");
  addElement("sfbd-"+index, "button", "sfb-"+index, "&nbsp;&nbsp;&times;");
  var el = document.getElementById("sfb-"+index);
  el.setAttribute("class", "changeArray");
  if (index==0)
  {
    el.setAttribute("title","You need at least one song (Delete disabled)")
  }
  else
  {
    el.setAttribute("title","Delete song.");
    el.setAttribute("onclick","removeSong("+index+")");
  }
}

function populateSonglistForm() {
  removeElementByClass("songForm");
  var songs = config.songList;
  songs.forEach((song, index) => addSongForm(song,index) );
}

function populateForm() {
  var el = document.getElementById("inPlainName");
  el.value = config.plainName;
  el = document.getElementById("inEmName");
  el.value = config.emName;
  el = document.getElementById("inPhotoURL");
  el.value = config.photoURL;
  el = document.getElementById("inPhotoHeight");
  el.value = config.photoHeight;
  populateSonglistForm();
}

function addSongPreview(song,index) {
  var parentEL = document.getElementById("songlist");
  var bgcolor = config["bgcolor"][index % 2]
  addElement("songlist","div","songInfo-"+index,"");
  var songInfo = document.getElementById("songInfo-"+index);
  songInfo.setAttribute("class","songInfo");
  songInfo.style.backgroundColor = bgcolor;
  songInfo.style.gridRow = (index+1)+"/span 1";
  songInfo.style.gridColumn = "1/span 1";
  addElement("songInfo-"+index,"strong","sit"+index,song["songTitle"]);
  songInfo.innerHTML += " ";
  addElement("songInfo-"+index,"em","sib"+index,"by");
  songInfo.innerHTML += " " + song["songArtist"];
  addElement("songlist","div","songLink-"+index,"");
  var songLink = document.getElementById("songLink-"+index);
  songLink.setAttribute("class","songLink");
  songLink.style.backgroundColor = bgcolor;
  songLink.style.gridRow = (index+1)+"/span 1";
  songLink.style.gridColumn = "2/span 1";
  addElement("songLink-"+index,"a","sla"+index,"Play ►");
  var songLinkA = document.getElementById("sla"+index);
  songLinkA.setAttribute("href",song["songURL"]);
  songLinkA.setAttribute("target","_blank");
  songLinkA.style.textDecoration = "none";
  songLinkA.style.color = config.fontcolor;
  songLinkA.style.textAlign = "right";
}

function populateSonglistPreview() {
  removeElementByClass("songInfo");
    removeElementByClass("songLink");
  var songs = config["songList"];
  songs.forEach((song, index) => addSongPreview(song,index) );
}

function populatePreview() {
  replaceInnerHTML("previewContainer", "");
  addElement("previewContainer", "div", "playlistContainer", "");
  var el = document.getElementById("playlistContainer");
  el.style.display = "table";
  el.style.backgroundColor = config['bgcolor'][1];
  el.style.marginLeft = "auto";
  el.style.marginRight = "auto";
  el.style.marginTop = "8px";
  el.style.border = "2px solid " + config.bordercolor;
  el.style.padding = "8px";
  el.style.color = config['fontcolor'];
  addElement("playlistContainer", "img", "HeadPhoto", "");
  el = document.getElementById("HeadPhoto");
  el.style.display = "block";
  el.style.marginLeft = "auto";
  el.style.marginRight = "auto";
  el.style.border = "1px solid " + config.bordercolor;
  el.src = config['photoURL'];
  el.height = config['photoHeight'];
  addElement("playlistContainer", "div", "namePlate", "");
  el = document.getElementById("namePlate");
  el.style.display = "table";
  el.style.marginLeft = "auto";
  el.style.marginRight = "auto";
  el.style.fontFamily = "Palatino Linotype, serif";
  el.style.fontSize = "18pt";
  addElement("namePlate", "span", "plainName", config.plainName);
  var elN = document.getElementById("plainName");
  elN.style.display = "inline";
  elN.style.fontStyle = "normal";
  el.innerHTML += "&nbsp;";
  addElement("namePlate", "span", "emName", config.emName);
  elN = document.getElementById("emName");
  elN.style.display = "inline";
  elN.style.fontStyle = "italic";
  addElement("playlistContainer", "div", "songlist", "");
  el = document.getElementById("songlist");
  el.style.display = "grid";
  el.style.marginTop = "8px";
  el.style.fontFamily = "Palatino Linotype, serif";
  el.style.gridTemplaeColumns = "auto max-content";
  el.style.padding = "8px";
  populateSonglistPreview();
}

function populateHTML() {
  var sourceHTML = document.getElementById("previewContainer").innerHTML;
  document.getElementById("HTMLbox").innerHTML = sourceHTML;
}

function loadCustomJSON() {
  var rawconfig = document.getElementById("JSONbox").value;
  config = JSON.parse(rawconfig);
  populateForm();
  populateCSVbox();
  populatePreview();
  populateHTML();
}

function loadCustomCSV() {
  var text = document.getElementById('CSVbox').value;
  var songList = [];
  for(var line of text.trim().split('\n')) {
    let fields = line.trim().split(',');
    let song = {};
    song['songTitle'] = fields[0];
    song['songArtist'] = fields[1];
    song['songURL'] = fields[2];
    songList.push(song);
  }
  if (songList != []) {
    config.songList = songList;
    populateForm();
    populateJSONbox();
    populatePreview();
    populateHTML();
  }
}

function loadConfig() {
  //config = document.getElementById("JSONbox").value;
  populateForm();
  populateJSONbox();
  populateCSVbox();
  populatePreview();
  populateHTML();
}

function populateJSONbox() {
  replaceInnerHTML("JSONbox",JSON.stringify(config,null,"  "));
}

function populateCSVbox() {
  var outputText = '';
  var songList = config.songList;
  for(var songindex in songList) {
    song = songList[songindex];
    outputText += song.songTitle + ', ' + song.songArtist + ', ' + song.songURL + '\n'
  }
  replaceInnerHTML("CSVbox",outputText);
}

function updateJSONOutput() {
  var outputText = JSON.stringify(config,null,"  ");
  document.getElementById("JSONbox").InnerHTML = outputText;
}

function copyToClipboard(elID) {
  var copyText = document.getElementById(elID);
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
}

function addElement(parentId, elementTag, elementId, html) {
    // Adds an element to the document
    var p = document.getElementById(parentId);
    var newElement = document.createElement(elementTag);
    newElement.setAttribute('id', elementId);
    newElement.innerHTML = html;
    p.appendChild(newElement);
    return newElement;
}

function replaceInnerHTML(parentID, html) {
  // Place or replace InnerHTML to a parent element
  var p = document.getElementById(parentID);
  p.innerHTML = html;
}

function addInnerHTML(parentID, html) {
  // Appends InnerHTML to a parent element
  var p = document.getElementById(parentID);
  p.innerHTML += html;
}

function removeElementByID(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

function removeElementByClass(className) {
    // Removes a class of elements from the document
    var elements = document.getElementsByClassName(className);
    var elen = elements.length;
    for (var i = elen-1; i > -1; i--) {
      elements[i].remove();
    }
}

window.onLoad = loadConfig();
