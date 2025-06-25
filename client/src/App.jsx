import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Stats from './pages/Stats'
import TeamStats from './pages/TeamStats'
function App() {

  const [count, setCount] = useState(0)
  const [array, setArray] = useState([]);
  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [stats, setStats] = useState([]);
  const [teamStats, setTeamStats] = useState({});
  const MYKEY = "f7f1bb20-0641-462b-96ab-def0baf31f6b";
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
  const BASE = "https://open.faceit.com/data/v4";
  const [championshipData, setChampionshipData] = useState([]);
  const [premadeTeamId, setPremadeTeamId] = useState("");
  const [matchData, setMatchData] = useState([]);
  const [regularSeasonId, setRegularSeasonId] = useState("");
  const [playoffSeasonId, setPlayoffSeasonId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [matchStatsCollection, setMatchStatsCollection] = useState([]);
  const [regular, setRegularSeasonStats] = useState({});
  const [playoffs, setPlayoffStats] = useState({});
  
  class matchStat {
    constructor(kills, deaths, assists, adr, kast, date, map, matchRoomLink, score1, score2, result, playoff, enemyTeamId, enemyTeamName) {
      this.kills = kills;
      this.deaths = deaths;
      this.assists = assists;
      this.adr = adr;
      this.kast = kast;
      this.date = date;
      this.map = map;
      this.matchRoomLink = matchRoomLink;
      this.score1 = score1;
      this.score2 = score2;
      this.result = result;
      this.playoff = playoff;
      this.enemyTeamId = enemyTeamId;
      this.enemyTeamName = enemyTeamName;
    }
  }
  class Season {
    constructor(seasonNumber, regularSeasonId, playoffSeasonId = null) {
      this.seasonNumber = seasonNumber;
      this.regularSeasonId = regularSeasonId;
      this.playoffSeasonId = playoffSeasonId;
    }
  }
  class regularSeasonStats {
    constructor(kills, deaths, assists, adr, kast) {
      this.kills = kills;
      this.deaths = deaths;
      this.assists = assists;
      this.adr = adr;
      this.kast = kast;
    }
  }

  class playoffStats {
    constructor(kills, deaths, assists, adr, kast) {
      this.kills = kills;
      this.deaths = deaths;
      this.assists = assists;
      this.adr = adr;
      this.kast = kast;
    }
  }

  useEffect(() => {
    console.log('matchData updated:', matchData);
  }, [matchData]);
  useEffect(() => {
    console.log('regularSeasonId updated:', regularSeasonId);
  }, [regularSeasonId]);
  useEffect(() => {
    console.log('playoffSeasonId updated:', playoffSeasonId);
  }, [playoffSeasonId]);

  useEffect(() => {
    console.log('premade team id updated:', premadeTeamId);
  }, [premadeTeamId]);

  useEffect(() => {
    console.log(import.meta.env.VITE_BASE_API_URL);
   }, []);

  const fetchPlayer = async (nick) => {
    const players = [];
    
    const { data: search } = await axios.get(`${BASE}/search/players`, {
      params: { nickname: nick, game: "cs2" },
      headers: { Authorization: `Bearer ${MYKEY}`},
    })

    

    players.push(...search.items)
    const player = players.find(player => nick.toLowerCase() === player.nickname.toLowerCase());

    console.log(player);
    setAvatarUrl(player.avatar);
    return player.player_id;
  }

  
  const fetchChampionshipData = async (premade_team_id, player_id) => {
    //https://www.faceit.com/api/team-leagues/v1/teams/ed2c71c5-0ec3-4ada-a9f5-5f555efdaf9e/profile/leagues/summary
    //https://www.faceit.com/api/team-leagues/v1/teams/ed2c71c5-0ec3-4ada-a9f5-5f555efdaf9e/profiles/leagues/summary
    //console.log(teamStats.premade_team_id);
    const { data } = await axios.get(`${BASE_API_URL}/api/faceit/team-leagues/v1/teams/${premade_team_id}/profile/leagues/summary`)
    console.log(data);
    //TODO: change to grab all seasons
    let championship_data = null;
    for (const season of data.payload[0].league_seasons_info) {
      if (season.season_number === '53') {
          console.log(season.season_number);
          if (season.season_standings.length > 1) {
            championship_data = new Season(season.season_number, season.season_standings[1].championship_id, season.season_standings[0].championship_id);
          }
          else {
            championship_data = new Season(season.season_number, season.season_standings[0].championship_id);
          }
      }    
      }
    console.log(championship_data);
    console.log(data.payload[0].league_seasons_info[1].season_standings);
    setChampionshipData(championship_data);
    return championship_data;
    //league_seasons_info[0] grabs the most recent season, in the future could be changed to grab all seasons / find more statistics
  }

  async function getCS2Stats(nickname) {
    
    const player_id = await fetchPlayer(nickname);
    setPlayerId(player_id);
    let match_data = [];
    let championship_data = null;
    let premade_team_id = null;
    try {
      console.log(player_id);
      const data = await axios.get(`${BASE_API_URL}/api/faceit/team-leagues/v2/leagues/a14b8616-45b9-4581-8637-4dfd0b5f6af8/users/${player_id}/teams/active`);
      console.log(data.data.payload[0]);
      setTeamStats(data.data.payload[0].team);
      console.log('premade team id: ', data.data.payload[0].team.premade_team_id)
      setPremadeTeamId(data.data.payload[0].team.premade_team_id)
      premade_team_id = data.data.payload[0].team.premade_team_id;
      //console.log(teamStats.premade_team_id);
      championship_data = await fetchChampionshipData(data.data.payload[0].team.premade_team_id, player_id);

      console.log('championship data: ', championship_data);
      if (championship_data.playoffSeasonId) {
        console.log("playoffs")
        setRegularSeasonId(championship_data.regularSeasonId);
        setPlayoffSeasonId(championship_data.playoffSeasonId);
      }
      else {
        console.log("regular season")
        setRegularSeasonId(championship_data.regularSeasonId);
      }

      
      console.log(championship_data);

        console.log("playoffs")
        const fetchMatchHistoryWithPlayoffs = async () => {
          //https://www.faceit.com/api/championships/v1/matches?participantId=ed2c71c5-0ec3-4ada-a9f5-5f555efdaf9e&participantType=TEAM&championshipId=26f3c678-a47a-4752-931c-3e46721b8b95&championshipId=bb5a00bd-411c-4618-a156-92374635093a&offset=0&sort=ASC
          let data = null;
          let participantType = "TEAM";
          let playoffid = championship_data.playoffSeasonId;
          let regid = championship_data.regularSeasonId;
          if (championship_data.playoffSeasonId) {
            const response = await axios.get(`${BASE_API_URL}/api/faceit/championships/v1/matches?participantId=${premade_team_id}&participantType=${participantType}&championshipIdPlayoffs=${playoffid}&championshipIdRegular=${regid}&limit=50&offset=0&sort=ASC`);
            data = response.data;
            const combinedMatchData = data[0].payload.items.concat(data[1].payload.items);
            console.log('combinedMatchData: ', combinedMatchData);
            setMatchData(combinedMatchData);
            return combinedMatchData;
          }
          else {
            console.log("fetching regular season data");
            const response = await axios.get(`${BASE_API_URL}/api/faceit/championships/v1/matches?participantId=${premade_team_id}&participantType=${participantType}&championshipId=${regid}&limit=50&offset=0&sort=ASC`);
            data = response.data.payload.items;
          }
          //"https://www.faceit.com/api/championships/v1/matches?participantId={0}&participantType=TEAM&championshipId={1}&limit=40&offset=0&sort=ASC";

          console.log(data);
          return data;
        }
        
        match_data = await fetchMatchHistoryWithPlayoffs();
        console.log(match_data);
    }
    catch (error) {
      console.log(error);
    }
    
    
    //const { data: stats } = await axios.get(`${BASE}/players/${player_id}/stats/cs2`, {
    //  headers: { Authorization: `Bearer ${MYKEY}`},
    //});

    const { data: stats } = await axios.get(`${BASE}/players/${player_id}/games/cs2/stats`, {
      headers: { Authorization: `Bearer ${MYKEY}`},
    });
    
    console.log(stats);
    return [stats, match_data, championship_data, premade_team_id, player_id];
  };

  // useEffect is a component that runs when the page is rendered
  useEffect(() => {
    
    //fetchAPI();
    //fetchPlayer("NICKHALDEN");
    //getCS2Stats("crspy");
  }, []);

 //  useEffect(() => {
 //   async function fetchData() {
 //     if (matchData.length > 0 && playerId &&(regularSeasonId || playoffSeasonId) && premadeTeamId) {
 //       console.log('player id: ', playerId);
 //       console.log('premade team id: ', premadeTeamId);
//        await processMatchData(matchData);
 //     }
//    }
 //   fetchData();
  //  if (matchData.length > 0 && playerId &&(regularSeasonId || playoffSeasonId) && premadeTeamId) {
  //    console.log('player id: ', playerId);
  //    console.log('premade team id: ', premadeTeamId);
  //    processMatchData(matchData);
  //  }
 // }, [regularSeasonId, playoffSeasonId, matchData]);

  const handleHomePageNick = async (nickname) => {
    try {
      const [unrefined_stats, match_data, championship_data, premade_team_id, player_id] = await getCS2Stats(nickname);
      console.log('championship data: ', championship_data);
      setStats(unrefined_stats.items);
      console.log('Raw match data:', match_data);
      console.log('Match data payload:', match_data?.payload);
      console.log('Match data items:', match_data?.payload?.items);
      console.log('regular season id: ', regularSeasonId);
      console.log('playoffId: ', playoffSeasonId);
      if (match_data) {
        //TODO: merge matchdata[0] and matchdata[1]
        await processMatchData(match_data, championship_data, premade_team_id, player_id);
        return true;
      } else {
        console.log('User is not on a league team');
        return true;
      }
    }
    catch (error) {
      console.error('Error fetching stats: ', error);
      return false;
    }
  }

  async function processMatchData(match_data, championship_data, premade_team_id, player_id) {
    //goals: display KDA, ADR, K/D ratio for each match
    //differentiate between regular season and playoff statistics
    //display average KDA, ADR, K/D Ratio for the season
    console.log('championship data: ', championship_data);
    console.log('match data: ', match_data);
    let matchStats = [];
    for (const match of match_data) {
      console.log(match);
      console.log(match.championshipId);
      const match_id = match.origin.id;
      console.log(match_id);
      console.log(player_id);
      try {
        const { data } = await axios.get(`${BASE_API_URL}/api/faceit/stats/v3/matches/${match_id}`);
        console.log(data);
        matchStats = data;
      }
      catch (error) {
        console.error('Error fetching match data: ', error);
      }
      if (matchStats.length > 0) {
      if (match.championshipId === championship_data.playoffSeasonId) {
        console.log(matchStats);
        //https://www.faceit.com/api/stats/v3/matches/{match_id}
        //1-2a836b7a-caa4-4afa-aead-752db07a7d73
        //1-2a836b7a-caa4-4afa-aead-752db07a7d73
        for(let i = 0; i < matchStats.length; i++) {
          if (i !== 0) {
            const enemyTeamId = matchStats[i].teams[0].teamId === premade_team_id ? matchStats[i].teams[1].teamId : matchStats[i].teams[0].teamId;
            const enemyTeamName = matchStats[i].teams[0].teamId === premade_team_id ? matchStats[i].teams[1].teamName : matchStats[i].teams[0].teamName;
            for (const team of matchStats[i].teams) {
              console.log(enemyTeamId);
              console.log(enemyTeamName);
              if (team.teamId === premade_team_id) {
                for (const player of team.players) {
                  if (player.playerId === player_id) {
                    let won = false;
                    if (matchStats[i].winner === premade_team_id) {
                      won = true;
                    }
                    const currMatch = new matchStat(player.kills, player.deaths, player.assists, player.adr, player.kast, matchStats[i].date, matchStats[i].map, match_id, matchStats[i].teams[0].score, matchStats[i].teams[1].score, won, true, enemyTeamId, enemyTeamName);
                    setMatchStatsCollection(prev => [...prev, currMatch])
                    console.log(currMatch)
                  }
                }
              }
            }
          }
        }
        //https://www.faceit.com/api/stats/v3/matches/1-998b845d-340c-4911-9350-9469f38f0623
        console.log("playoffs");
      }
      else if (match.championshipId === championship_data.regularSeasonId) {
        //https://www.faceit.com/api/stats/v3/matches/{match_id}
        //https://www.faceit.com/api/stats/v3/matches/1-b47ae73f-60e4-4e8d-968e-0a3b17b5ba1a
        console.log(matchStats[0].map)
        console.log(matchStats[0].teams)
        //opens up the match stats for each player
        for (const team of matchStats[0].teams) {
          const enemyTeamId = matchStats[0].teams[0].teamId === premade_team_id ? matchStats[0].teams[1].teamId : matchStats[0].teams[0].teamId;
          const enemyTeamName = matchStats[0].teams[0].teamId === premade_team_id ? matchStats[0].teams[1].teamName : matchStats[0].teams[0].teamName;
          if (team.teamId === premade_team_id) {
            console.log(enemyTeamId);
            console.log(enemyTeamName);
            for (const player of team.players) {
              if (player.playerId === player_id) {
                let won = false;
                if (matchStats[0].winner === premade_team_id) {
                  won = true;
                }
                const currMatch = new matchStat(player.kills, player.deaths, player.assists, player.adr, player.kast, matchStats[0].date, matchStats[0].map, match_id, matchStats[0].teams[0].score, matchStats[0].teams[1].score, won, false, enemyTeamId, enemyTeamName);
                setMatchStatsCollection(prev => [...prev, currMatch])
                console.log('nickname: ', player.nickname);
                console.log('kills: ', player.kills);
                console.log('deaths: ', player.deaths);
                console.log('assists: ', player.assists);
                console.log('k/d ratio: ', player.kills / player.deaths);
                console.log('adr: ', player.adr);
              }
            }
          }
        }
        console.log("regular season");
      }
    }
    }
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home handleHomePageNick={handleHomePageNick} />} />
        <Route path="/stats" element={<Stats stats={stats} avatarUrl={avatarUrl} teamStats={teamStats} matchData={matchData} matchStatsCollection={matchStatsCollection}/>} />
        <Route path="/teamstats" element = {<TeamStats />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
