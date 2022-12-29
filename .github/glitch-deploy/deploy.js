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


const listProject = `https://c64d28d6-49b6-49d9-8502-c9bee1e48f77@api.glitch.com/git/mysterious-juniper-wizard|https://c64d28d6-49b6-49d9-8502-c9bee1e48f77@api.glitch.com/git/stitch-jumpy-giraffatitan|https://c64d28d6-49b6-49d9-8502-c9bee1e48f77@api.glitch.com/git/evergreen-spiffy-lumber|https://c64d28d6-49b6-49d9-8502-c9bee1e48f77@api.glitch.com/git/adorable-rural-doll|https://c64d28d6-49b6-49d9-8502-c9bee1e48f77@api.glitch.com/git/plume-dull-dolphin|https://c64d28d6-49b6-49d9-8502-c9bee1e48f77@api.glitch.com/git/fluttering-lilac-burn|https://c64d28d6-49b6-49d9-8502-c9bee1e48f77@api.glitch.com/git/tranquil-special-pin|https://c64d28d6-49b6-49d9-8502-c9bee1e48f77@api.glitch.com/git/obtainable-autumn-badge|https://c64d28d6-49b6-49d9-8502-c9bee1e48f77@api.glitch.com/git/lead-possible-lily|https://c64d28d6-49b6-49d9-8502-c9bee1e48f77@api.glitch.com/git/magical-lake-television|https://c64d28d6-49b6-49d9-8502-c9bee1e48f77@api.glitch.com/git/stealth-thin-idea|https://c64d28d6-49b6-49d9-8502-c9bee1e48f77@api.glitch.com/git/frosted-lime-radio|https://c64d28d6-49b6-49d9-8502-c9bee1e48f77@api.glitch.com/git/artistic-daily-sesame|https://c64d28d6-49b6-49d9-8502-c9bee1e48f77@api.glitch.com/git/quickest-innate-sternum`.trim().split('|');

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