var jsonToTable = function(json, tableName) {
  var table = "<table class='table-bordered'>";
  var parsed = json.results;
  var keys = getKeys(parsed[0]);
  table += getColumnHeaders(keys);
  $.each(parsed, function(i, val) {
    var row = '';
    var id;
    for (var key in val) {
      if (key !== 'id') {
        row += '<td>' + val[key] + '</td>';
      } else {
        id = val[key];
        row += "<tr data-id='" + val[key] + "'>";
      }
    }
    row += "<td><button data-type='" + tableName + "' data-id='" + id + "' class='btn btn-danger delete'>Delete</button></td>";
    row += '</tr>';
    table += row;
  });
  table += "</table>";
  return table;  
};

var composeForm = function(selector, keys) {
  var type = selector.substring(1);
  var form = "<form class='form-horizontal'>";
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] === 'id') continue;
    form += "<div class='form-group'><label class='col-sm-2 control-label'>" + keys[i] + "</label>";
    form += "<div class='col-sm-6'>";
    form += "<input type='text' class='form-control' id='" + keys[i] + "'>";
    form += "</div></div>";
  }
  form += "<div class='form-group'><div class='col-sm-10 col-sm-offset-7'>";
  form += "<button class='btn btn-submit save' data-type='" + type + "' type='submit'>Save</button>";
  form += "</div></div>";
  form += "</form>";

  return form;
};

var getKeys = function(data) {
  var keys = [];
  for (var key in data) {
    keys.push(key);
  }
  return keys;
};

var getColumnHeaders = function(keys) {
  var header = '<tr>';
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] !== 'id') {
      header += '<th>' + keys[i] + '</th>';
    }
  }
  header += '<th>Delete</th>';
  header += '</tr>';
  return header;
};

var composePost = function(e) {
  var data = {};
  var selector = '#' + $(e.target).attr('data-type') + ' .form-group';
  var entries = $(selector).each(function(i, el) {
    var label = $('label', el).text();
    if (label.length > 0) {
      var inputVal = $('input', el).val().length > 0 ? $('input', el).val() : null;
      data[label] = inputVal;
    }
  });

  return data;
};

var findUrl = function(e) {
  return '/' + $(e.target).attr('data-type');
};

var submitEntry = function(e) {
  e.preventDefault();
  var data = composePost(e);
  var url = findUrl(e);
  $.ajax({
    url: url,
    dataType: 'json',
    type: 'POST',
    data: data,
    success: function() {
      render();
    }
  });  
};

var deleteEntry = function(e) {
  e.preventDefault();
  var req = { 'id': $(e.target).attr('data-id') };
  var url = '/' + $(e.target).attr('data-type');

  $.ajax({
    url: url,
    dataType: 'json',
    data: req,
    type: 'DELETE',
    success: function(data) {
      render();
    }
  }); 
}

var renderTable = function(url, selector) {
  $.ajax({
    url: url,
    dataType: 'json',
    success: function(data) {
      $(selector).html('');
      $(selector).append('<h3>' + selector.substring(1) + '</h3>' + jsonToTable(data, selector.substring(1)));
      $(selector).append(composeForm(selector, getKeys(data.results[0])));
      $(selector + ' .save').on('click', submitEntry);
      $(selector + ' .delete').on('click', deleteEntry);
    }
  });
};

var makeSelect = function(data) {
  
};

var renderSearch = function(selector) {
  var searchForm = "<h3>Search Star Trek Characters</h3>";
  searchForm += "<ul id='results'></ul>";
  searchForm += "<form class='form-horizontal'><div class='form-group'>";
  searchForm += "<label class='control-label'>";
};

var render = function() {
   renderTable('/actors', '#actors');
   renderTable('/characters', '#characters');
   renderTable('/episodes', '#episodes');
   renderTable('/series', '#series');
   renderTable('/studios', '#studios');
   renderTable('/actor_character', '#actor_character');
   renderTable('/actor_series', '#actor_series');
   renderTable('/character_episode', '#character_episode');
   renderSearch('#characterSearch');
};

$(document).ready(function() {
  render();
});