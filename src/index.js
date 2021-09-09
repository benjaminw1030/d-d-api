import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import DndApi from './js/dnd.js';

function clearFields() {
  $('ul#spell-list').empty();
  $('#spell-details').empty();
}

function attachContactListener(spell) {
  $(`li#${spell.index}`).click(function () {
    $('#spell-details').empty();
    DndApi.spellDetails(spell.url)
    .then (function(response) {
      outputSpellDetails(response);
    });
  });
}

function createSpellList(response) {
  if (response.results) {
    response.results.forEach(spell => {
      $('ul#spell-list').append(`<li id="${spell.index}">${spell.name}</li>`);
      attachContactListener(spell);
    });
  } else {
    $('#error-output').text(`There was an error: ${response.message}`);
  }
}

function outputSpellDetails(response) {
  let components = response.components.join(", ");
  $('div#spell-details').append(`<h5>${response.name}</h5>
  <p>${response.desc[0]}</p>
  <p>Casting time: ${response.casting_time}</p>
  <p>Duration: ${response.duration}</p>
  <p>Range: ${response.range}</p>
  <p>Components: ${components}</p>
  <p>School: ${response.school.name}</p>`);
}

$(document).ready(function () {
  $('#spell-search').submit(function (event) {
    event.preventDefault();
    let level = $("#spell-level").val();
    let school = $("#spell-school").val();
    clearFields();
    DndApi.searchSpell(level, school)
      .then(function (response) {
        createSpellList(response);
      });
  })
});
