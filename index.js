const core = require("@actions/core");
const github = require("@actions/github");
const Sentiment = require("sentiment");

// List of gifs - should be 21 long so that ever .5 increment of sentiment can have a unique gif.
// // These should be in order from -5 -> +5 (most negative mood to most positive)
const allGifs = [
  {
    // Link to gif
    link: "~/gifs/mad/5.gif",
    // Alt text for gif
    alt: "Anger from Inside Out yellling and lighting his head on fire",
  },
  {
    // Link to gif
    link: "~/gifs/mad/4.gif",
    // Alt text for gif
    alt: "Nick Miller from New Girl bashing his face into a pillow repeatedly",
  },
  {
    // Link to gif
    link: "~/gifs/mad/3.gif",
    // Alt text for gif
    alt: "Man angrily chewing and glaring from inside his car",
  },
  {
    // Link to gif
    link: "~/gifs/mad/2.gif",
    // Alt text for gif
    alt:
      "Nick Miller from New Girl singing 'It's miserable and magical. Oh yeah'",
  },
  {
    // Link to gif
    link: "~/gifs/mad/1.gif",
    // Alt text for gif
    alt: "The Grinch saying 'Fine' with a slightly disappointed look",
  },
  {
    // Link to gif
    link: "~/gifs/0.gif",
    // Alt text for gif
    alt: "Boo from Monsters Inc blinking and looking into space neutrally",
  },
  {
    // Link to gif
    link: "~/gifs/happy/1.gif",
    // Alt text for gif
    alt: "Sonic the Hedgehog dancing and twirling",
  },
  {
    // Link to gif
    link: "~/gifs/happy/2.gif",
    // Alt text for gif
    alt: "Pig holding a pinwheel while out the window excitedly",
  },
  {
    // Link to gif
    link: "~/gifs/happy/3.gif",
    // Alt text for gif
    alt: "Minions cheering and clapping",
  },
  {
    // Link to gif
    link: "~/gifs/happy/4.gif",
    // Alt text for gif
    alt: "Anna from Frozen being overjoyed",
  },
  {
    // Link to gif
    link: "~/gifs/happy/5.gif",
    // Alt text for gif
    alt:
      "Fairly  Odd Parents shaking maracas while confetti falls from the ceiling",
  },
];

async function run() {
  try {
    const githubToken = core.getInput("GITHUB_TOKEN");
    const pullRequestNumber = github.context.payload.pull_request.number;
    const octokit = new github.getOctokit(githubToken);
    // Analyze the mood of the Pull Request's body
    let mood = new Sentiment();
    let result = mood.analyze(github.context.payload.pull_request.body);
    let resultIndex = Math.round(result + 5); // index of gif to look up
    console.log(resultIndex);
    let altText = allGifs[resultIndex].alt;
    let gif = allGifs[resultIndex].link;
    const message = `You're Pull Request scored ${result} out of a possible +5. 
    
    We estimate your mood was roughly:
    ![${altText}](${gif})
    `;
    try {
      octokit.issues.createComment({
        repo: github.context.payload.repository.name,
        owner: github.context.payload.repository.owner.login,
        issue_number: pullRequestNumber,
        body: message,
      });
    } catch (error) {
      console.log("ERROR: ", error);
    }
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
