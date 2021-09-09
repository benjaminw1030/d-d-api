export default class DndApi {
  static searchSpell(level, school) {
    return fetch(`https://www.dnd5eapi.co/api/spells?level=${level}&school=${school}`)
      .then(function (response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .catch(function (error) {
        return error;
      })
  }

  static spellDetails(url) {
    return fetch(`https://www.dnd5eapi.co${url}`)
      .then(function (response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .catch(function (error) {
        return error;
      })
  }
}