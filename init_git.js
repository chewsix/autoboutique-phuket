const fs = require('fs');
const path = require('path');
const gitPath = 'C:/Users/teenl/AppData/Local/npm-cache/_npx/94b3aa09f329ed7a/node_modules/isomorphic-git';

async function main() {
  try {
    const git = require(gitPath);
    await git.init({ fs, dir: '.' });
    console.log('✅ Git repository initialized successfully (.git directory created).');
    
    // Status matrix to add files (respecting .gitignore)
    const FILE = 0, WORKDIR = 2, STAGE = 3;
    const status = await git.statusMatrix({ fs, dir: '.' });
    
    for (const row of status) {
      const filepath = row[FILE];
      const head = row[1];
      const workdir = row[WORKDIR];
      const stage = row[STAGE];
      
      // If file is not ignored and exists in workdir
      if (workdir !== 0) {
        await git.add({ fs, dir: '.', filepath });
      }
    }
    
    const sha = await git.commit({
      fs,
      dir: '.',
      message: 'feat: Autoboutique Phuket luxury detailing studio upgrade (no car size, PromptPay slip verification, packages, admin portal, LINE notify)',
      author: {
        name: 'Autoboutique Phuket Developer',
        email: 'dev@autoboutiqueth.com'
      }
    });
    
    console.log('✅ Initial commit created successfully! Commit SHA:', sha);
  } catch (err) {
    console.error('Error during git operation:', err);
  }
}

main();
