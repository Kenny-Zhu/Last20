import React, { useState, useEffect } from 'react'

//goals: calculate
//avg kills
//avg deaths
//KD ratio
//KPR
//ADR
//WR
//KAST
function Stats({stats, avatarUrl}) {

  const [avgDeaths, setAvgDeaths] = useState(0);
  const [kdRatio, setKdRatio] = useState(0);
  const [avgKills, setAvgKills] = useState(0);
  const [kpr, setKpr] = useState(0);
  const [adr, setAdr] = useState(0);
  const [wr, setWr] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [matchHistory, setMatchHistory] = useState([]);

  useEffect (() => {
    let kills = 0;
    let deaths = 0;
    let killdeathratio = 0;
    let roundsplayed = 0;
    let wins = 0;
    let damage = 0;

    for (const stat in stats) {
        console.log(stat);
        const match = stats[stat];
        console.log(match);
        console.log(match.stats.Kills);
        
        kills += parseFloat(match.stats.Kills);
        deaths += parseFloat(match.stats.Deaths);
        roundsplayed += parseFloat(match.stats.Rounds);
        damage += parseFloat(match.stats.ADR);
        if (match.stats.Result === "1") {
            wins += 1;
        }
    }
    console.log(stats[0].stats.Nickname);
    setPlayerName(stats[0].stats.Nickname);
    console.log(playerName);
    setWr((wins / stats.length) * 100);
    console.log("wr: ", wr);
    killdeathratio = kills / deaths;
    setKdRatio(killdeathratio);
    setKpr(kills / roundsplayed);
    setAdr(damage / stats.length);
    setAvgKills(kills / stats.length);
    setAvgDeaths(deaths / stats.length);

    console.log(kills, deaths, roundsplayed, killdeathratio);
    //console.log(avgDeaths, kdRatio, avgKills, kpr);
  }, [kpr, kdRatio, avgKills, avgDeaths, adr, wr, playerName]);

  const pretty = (iso) => new Date(iso).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  const result = (result) => {
    if (result === "1") {
      return "Win";
    }
    else {
      return "Loss";
    }
  }
  return (
    <>
    <div className="back-button-container">
            <nav>
                <form action="/">
                <button className="back-button">Back</button>
                </form>
            </nav>
    </div>
    <div className="stats-container-parent">
      <h1>Player Statistics</h1>
      <div className="stats-container-child">
        <div className="stats-container-child-header">
          <img className="avatar-image"src={avatarUrl} alt="Avatar" />
          <h2>{playerName}</h2>
        </div>
        <div className="stats-container-child-row1">
        
        <h2>kpr: {kpr.toFixed(2)}</h2>
        <h2>K/D: {kdRatio.toFixed(2)}</h2>
        <h2>Avg Kills: {avgKills.toFixed(0)}</h2>
        </div>
        <div className="stats-container-child-row2">
          <h2>Avg Deaths: {avgDeaths.toFixed(0)}</h2>
          <h2>ADR: {adr.toFixed(0)}</h2>
          <h2>WR: {wr}%</h2>
        </div>
      </div>
      
      <div className="stats-container">
        <h2 style={{color: "white"}}>Match History</h2>
        <div className="stats-grid">
        {stats?.map((match, index) => (
              <div key={index} className="stats-grid-item">
                <span>{pretty(match.stats["Created At"])} <span style={{color: match.stats.Result === "1" ? "green" : "red"}}>{result(match.stats.Result)}</span> KDA: {match.stats.Kills}/{match.stats.Deaths}/{match.stats.Assists}, ADR: {match.stats.ADR} Map: {match.stats.Map} <a href={"https://faceit.com/en/cs2/room/" + match.stats["Match Id"]} target="_blank" rel="noopener noreferrer" id="match-link">Link</a> </span>
                <br></br>
              </div>
            ))}
        </div>
      </div>
    </div>
    </>
  )
}

export default Stats
