import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

const Eris = require('eris');
const discordBotEris = new Eris(process.env.REACT_APP_DISCORD_BOT_TOKEN, { restMode: true });

discordBotEris.on('ready', async () => {
  let self = await discordBotEris.getSelf();
  // let rad = await discordBotEris.getRESTUser(process.env.REACT_APP_DISCORD_ID)
  let guilds = discordBotEris.getRESTUser("261700562649612289");
  console.log('redy ' + self.username + '#' + self.discriminator);
  console.log(guilds)
  discordBotEris.editStatus('invisible');
})

discordBotEris.connect();

function App() {
  useEffect(() => {
    console.log(discordBotEris)
    console.log(process.env)
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          New node version: 17.0.1
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
