const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://9c94a972-1aa7-4555-b650-1f0755d4e822@api.glitch.com/git/foregoing-lunar-rat|https://9c94a972-1aa7-4555-b650-1f0755d4e822@api.glitch.com/git/accurate-vine-bandicoot|https://9c94a972-1aa7-4555-b650-1f0755d4e822@api.glitch.com/git/octagonal-bejewled-patch|https://9c94a972-1aa7-4555-b650-1f0755d4e822@api.glitch.com/git/few-inexpensive-anaconda|https://9c94a972-1aa7-4555-b650-1f0755d4e822@api.glitch.com/git/vast-flashy-bedbug|https://9c94a972-1aa7-4555-b650-1f0755d4e822@api.glitch.com/git/sleet-chrome-brow|https://9c94a972-1aa7-4555-b650-1f0755d4e822@api.glitch.com/git/alive-adhesive-megaraptor|https://9c94a972-1aa7-4555-b650-1f0755d4e822@api.glitch.com/git/principled-polyester-mousepad|https://9c94a972-1aa7-4555-b650-1f0755d4e822@api.glitch.com/git/planet-enchanting-wolf|https://9c94a972-1aa7-4555-b650-1f0755d4e822@api.glitch.com/git/arrow-quick-shell|https://9c94a972-1aa7-4555-b650-1f0755d4e822@api.glitch.com/git/habitual-furry-sheet|https://9c94a972-1aa7-4555-b650-1f0755d4e822@api.glitch.com/git/simple-square-ozraraptor|https://9c94a972-1aa7-4555-b650-1f0755d4e822@api.glitch.com/git/torpid-maize-stem|https://9c94a972-1aa7-4555-b650-1f0755d4e822@api.glitch.com/git/jagged-octagonal-saga`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();