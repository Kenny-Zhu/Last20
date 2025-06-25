import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRef } from 'react';
//goals: calculate
//avg kills
//avg deaths
//KD ratio
//KPR
//ADR
//WR
//KAST
function Stats({stats, avatarUrl, teamStats, matchStatsCollection}) {

  const [avgDeaths, setAvgDeaths] = useState(0);
  const [kdRatio, setKdRatio] = useState(0);
  const [avgKills, setAvgKills] = useState(0);
  const [kpr, setKpr] = useState(0);
  const [adr, setAdr] = useState(0);
  const [wr, setWr] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [matchHistory, setMatchHistory] = useState([]);
  const [championshipData, setChampionshipData] = useState([]);
  const [teamName, setTeamName] = useState("");

  const [leagueKills, setLeagueKills] = useState(0);
  const [leagueDeaths, setLeagueDeaths] = useState(0);
  const [leagueAssists, setLeagueAssists] = useState(0);
  const [leagueAdr, setLeagueAdr] = useState(0);
  const [leagueKast, setLeagueKast] = useState(0);
  const [leagueKpr, setLeagueKpr] = useState(0);
  const [leagueKd, setLeagueKd] = useState(0);

  const [showLeagueStats, setShowLeagueStats] = useState(false);
  const isFetchedRef = useRef(false);
  useEffect (() => {
    let kills = 0;
    let deaths = 0;
    let killdeathratio = 0;
    let roundsplayed = 0;
    let wins = 0;
    let damage = 0;
    console.log(matchStatsCollection);
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
    
    setTeamName(teamStats.name);
    console.log(teamStats.premade_team_id);
    if (!isFetchedRef.current) {
      const fetchChampionshipData = async () => {
        //https://www.faceit.com/api/team-leagues/v1/teams/ed2c71c5-0ec3-4ada-a9f5-5f555efdaf9e/profile/leagues/summary
        //https://www.faceit.com/api/team-leagues/v1/teams/ed2c71c5-0ec3-4ada-a9f5-5f555efdaf9e/profiles/leagues/summary
        const { data } = await axios.get(`http://localhost:8080/api/faceit/team-leagues/v1/teams/${teamStats.premade_team_id}/profile/leagues/summary`)
        console.log(data);
        
        console.log(data.payload[0].league_seasons_info[0].season_standings);
        setChampionshipData(data.payload[0].league_seasons_info[0].season_standings);
        //league_seasons_info[0] grabs the most recent season, in the future could be changed to grab all seasons / find more statistics
      }
    
    console.log("fetching championship data");
    fetchChampionshipData();
    console.log(championshipData);

    isFetchedRef.current = true;
  }
    console.log(kills, deaths, roundsplayed, killdeathratio);
    //console.log(avgDeaths, kdRatio, avgKills, kpr);
  }, [kpr, kdRatio, avgKills, avgDeaths, adr, wr, playerName, teamName, championshipData]);

  useEffect(() => {
    const totalMatches = matchStatsCollection.length;
    console.log(matchStatsCollection);
    
    let kills = 0;
    let deaths = 0;
    let assists = 0;
    let adr = 0;
    let kast = 0;
    let totalRounds = 0;
    for (const match of matchStatsCollection) {
      totalRounds += match.score1;
      totalRounds += match.score2;
      kills += match.kills;
      deaths += match.deaths;
      assists += match.assists;
      adr += match.adr;
      kast += match.kast;
    }
    setLeagueKills(kills / totalMatches);
    setLeagueDeaths(deaths / totalMatches);
    setLeagueAssists(assists / totalMatches);
    setLeagueAdr(adr / totalMatches);
    setLeagueKast(kast / totalMatches);
    setLeagueKpr(kills / totalRounds);
    setLeagueKd(kills / deaths);
  }, [matchStatsCollection, leagueKills, leagueDeaths, leagueAssists, leagueAdr, leagueKast, leagueKpr]);
  //https://www.faceit.com/api/match/v2/match/{match_id} 
  //this grabs names within the matchpage
  //https://www.faceit.com/api/stats/v3/matches/{match_id}
  //detailed match statistics
  //https://www.faceit.com/api/team-leagues/v1/teams/{team_id}
  // ^ grabs championship id
  //https://www.faceit.com/api/championships/v1/matches?participantId={team_id}&participantType=TEAM&championshipId={championship_id_playoffs}&championshipId={championship_id_regular}&offset=0&sort=ASC
  //
  // ^ fetches matches
  //ex: http://www.faceit.com/api/championships/v1/matches?participantId=ed2c71c5-0ec3-4ada-a9f5-5f555efdaf9e&championshipId=26f3c678-a47a-4752-931c-3e46721b8b95&championshipId=bb5a00bd-411c-4618-a156-92374635093a&offset=0&sort=ASC
  // https://www.faceit.com/api/championships/v1/matches?participantId=ed2c71c5-0ec3-4ada-a9f5-5f555efdaf9e&participantType=TEAM&championshipId=26f3c678-a47a-4752-931c-3e46721b8b95&championshipId=bb5a00bd-411c-4618-a156-92374635093a&limit=20&offset=0&sort=ASC




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
    {showLeagueStats && <div className="stats-container-parent">
      <h1>League Statistics</h1>
      <h2> {teamStats.avatar_url ? <img style={{width: "50px", height: "50px"}} src={teamStats.avatar_url} alt="Team Avatar" /> : null} {teamStats.name ? teamStats.name : "No team"}  </h2>
      <a onClick={() => setShowLeagueStats(false)}>Individual Stats</a>
      {matchStatsCollection.length > 0 ? <div className="stats-container-child">
        <div className="stats-container-child">
          <div className="stats-container-child-header">
          <img className="avatar-image"src={avatarUrl} alt="Avatar" />
          <h2>{playerName}</h2>
          </div>
          <div className="stats-container-child-row1">
            
        <h2 >kpr: {leagueKpr.toFixed(2)}</h2>
        
        <h2 >K/D: {leagueKd.toFixed(2)}</h2>
        <h2 >Avg Kills: {leagueKills.toFixed(0)}</h2>
        
        </div>
        
        <div className="stats-container-child-row2">
          <h2>Avg Deaths: {leagueDeaths.toFixed(0)}</h2>
          <h2>ADR: {leagueAdr.toFixed(0)}</h2>
        </div>
        </div>
        
      </div> : <div className="stats-container-child"> 
      <div className="stats-container-child-header">
          <img className="avatar-image"src={avatarUrl} alt="Avatar" />
          <h2>{playerName}</h2>
          <div className="stats-container-child-row1">
          
          </div>
           </div>
          </div>}
          
          
          <table className="stats-table">
            <tr className="stats-table-header">
                <th>Match Type</th>
                <th>Map</th>
                <th>Kills</th>
                <th>Deaths</th>
                <th>Assists</th>
                <th>ADR</th>
                <th>KAST</th>
                <th>K/D</th>
                <th>Enemy Team</th>
                <th>Score</th>
                <th>Room</th>
          </tr>
      {matchStatsCollection.map((map, index) => (
              <tr>
                <td className="stats-table-match-type" value={map.playoff ? "Playoff" : "Regular Season"}>{map.playoff ? "Playoff" : "Regular"} <span style={{color: map.result === true ? "green" : "red"}}>{map.result ? " W" : " L"}</span></td>
                <td>{map.map}</td>
                <td>{map.kills}</td>
                <td>{map.deaths}</td>
                <td>{map.assists}</td>
                <td>{map.adr}</td>
                <td>{map.kast}%</td>
                <td>{(map.kills / map.deaths).toFixed(1)}</td>
                <td>{map.enemyTeamName}</td>
                <td>{map.score1} - {map.score2}</td>
                <td><a href={"https://faceit.com/en/cs2/room/" + map.matchRoomLink} target="_blank" rel="noopener noreferrer" id="match-link">Link</a></td>
              </tr>
            
          ))}

    </table>

    </div>}
    {!showLeagueStats && <div className="stats-container-parent">
      <h1>Player Statistics</h1>
      <h2> {teamStats.avatar_url ? <img style={{width: "50px", height: "50px"}} src={teamStats.avatar_url} alt="Team Avatar" /> : null} {teamStats.name ? teamStats.name : "No team"}  </h2>
      {teamStats ? <a onClick={() => setShowLeagueStats(true)}>League Stats</a> : null}

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
    </div>}
    </>
  )
}

export default Stats
