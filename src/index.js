import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import DndApi from './js/dnd.js';

function clearFields() {
  $('ul#output-list').empty();
  $('#output-details').empty();
}

function attachContactListener(item) {
  $(`li#${item.index}`).click(function () {
    $('#output-details').empty();
    DndApi.getDetails(item.url)
      .then(function (response) {
        $("ul#output-list > li.active").removeClass("active");
        $(`li#${response.index}`).addClass("active");
        if (response.school !== undefined) {
          outputSpellDetails(response);
        } else {
          outputMonsterDetails(response);
          console.log("monster")
        }
      });
  });
}

function createList(response) {
  if (response.results) {
    response.results.forEach(item => {
      $('ul#output-list').append(`<li class="list-group-item" id="${item.index}">${item.name}</li>`);
      attachContactListener(item);
    });
  } else {
    $('#error-output').text(`There was an error: ${response.message}`);
  }
}

function assignOrdinal(n) {
  let s = ["th", "st", "nd", "rd"];
  let v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function obtainClassNameList(classes) {
  let classArray = []
  classes.forEach(charClass => {
    classArray.push(charClass.name);
  });
  return classArray.join(", ")
}

function outputSpellDetails(response) {
  let components = response.components.join(", ");
  let level = assignOrdinal(response.level);
  let subheaderLine = `${level} level ${response.school.name}`
  let classes = obtainClassNameList(response.classes);
  let durationLine = `Concentration, ${(response.duration).toLowerCase()}`
  let subclassLine = ""
  if (response.concentration === false) {
    durationLine = response.duration;
  }
  if (response.ritual === true) {
    subheaderLine += " (ritual)";
  }
  if (response.subclasses.length !== 0) {
    subclassLine = `<p><b>Subclasses:</b> ${obtainClassNameList(response.subclasses)}</p>`;
  }
  $('div#output-details').append(`<h5>${response.name}</h5>
  <p><em>${subheaderLine}</em></p>
  <p><b>Casting Time:</b> ${response.casting_time}</p>
  <p><b>Range:</b> ${response.range}</p>
  <p><b>Components:</b> ${components}</p>
  <p><b>Duration:</b> ${durationLine}</p>
  <p>${response.desc[0]}</p>
  <p><b>Classes:</b> ${classes}</p>
  ${subclassLine}`);
}

function outputMonsterDetails(response) {
  $('div#output-details').append(`<h5>${response.name}</h5>`);
}

$(document).ready(function () {
  $('#spell-search').submit(function (event) {
    event.preventDefault();
    let level = $("#spell-level").val();
    let school = $("#spell-school").val();
    clearFields();
    DndApi.searchSpell(level, school)
      .then(function (response) {
        createList(response);
      });
  })

  $('#monster-search').submit(function (event) {
    event.preventDefault();
    let CR = $("#challenge-rating").val();
    clearFields();
    DndApi.searchMonster(CR)
      .then(function (response) {
        createList(response);
      });
  })
});
