/* In this module, create three classes: Play, Act, and Scene. */

// Class representing a Scene in a play
export class Scene {
  constructor(name, title, stageDirection, speeches) {
    this.name = name;
    this.title = title;
    this.stageDirection = stageDirection;
    this.speeches = speeches;
  }

  // Function to create and return the HTML representation of a scene, highlighting a specified searchText
  makeScene(searchText) {
    let sceneDiv = document.createElement("div");
    sceneDiv.id = "sceneHere";

    let h4 = document.createElement("h4");
    h4.textContent = this.name;
    sceneDiv.appendChild(h4);

    let sceneTitle = document.createElement("p");
    sceneTitle.classList.add("title");
    sceneTitle.textContent = this.title;
    sceneDiv.appendChild(sceneTitle);

    let stageDirect = document.createElement("p");
    stageDirect.classList.add("direction");
    stageDirect.textContent = this.stageDirection;
    sceneDiv.appendChild(stageDirect);

    this.speeches.forEach(speech => {
      let speechDiv = document.createElement("div");
      speechDiv.classList.add("speech");
      let span = document.createElement("span");
      let speechP = document.createElement("p");
      span.textContent = speech.speaker;
      speechP.textContent = speech.lines;
      const text = speechP.textContent;
      const wordToHighlight = searchText;
      const highlightedText = text.replace(wordToHighlight, `<span style="font-weight: bold; background-color: yellow; display: inline;">${wordToHighlight}</span>`);
      const highlightedElement = document.createElement("div");
      highlightedElement.innerHTML = highlightedText;
      speechDiv.appendChild(span);
      speechDiv.appendChild(highlightedElement);
      sceneDiv.appendChild(speechDiv);
    });

    return sceneDiv;
  }
}

// Class representing an Act in a play
export class Act {
  constructor(name, scenes) {
    this.name = name;
    this.scenes = scenes.map(sceneData => new Scene(sceneData.name, sceneData.title, sceneData.stageDirection, sceneData.speeches));
  }

  // Function to create and return the HTML representation of an act, highlighting a specified searchText
  makeAct(searchText) {
    var actSection = document.createElement("article");
    actSection.id = "actHere";
    var h3 = document.createElement("h3");
    h3.textContent = this.name;
    actSection.appendChild(h3);

    this.scenes.forEach(sceneData => {
      let newScene = new Scene(sceneData.name, sceneData.title, sceneData.stageDirection, sceneData.speeches);
      actSection.appendChild(newScene.makeScene(searchText));
    });

    return actSection;
  }
}

// Class representing a Play
export class Play {
  constructor(title, short, persona, acts) {
    this.title = title;
    this.short = short;
    this.persona = persona;
    this.acts = acts.map(data => new Act(data.name, data.scenes));
  }

  // Function to create and return the HTML representation of a play
  makePlay() {
    var playSection = document.createElement("section");
    playSection.id = "playHere";
    var h2 = document.createElement("h2");
    h2.textContent = this.title;
    playSection.appendChild(h2);

    this.acts.forEach(actData => {
      let newAct = new Act(actData.name, actData.scenes);
      playSection.appendChild(newAct.makeAct());
    });

    return playSection;
  }
}
