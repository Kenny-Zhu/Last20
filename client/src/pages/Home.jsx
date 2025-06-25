import { useState, useEffect } from 'react'
import '../App.css'
import axios from 'axios'
import { BrowserRouter, useNavigate } from 'react-router-dom'

function App({handleHomePageNick}) {
  const [count, setCount] = useState(0)
  const [array, setArray] = useState([]);
  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [stats, setStats] = useState([]);
  const MYKEY = "f7f1bb20-0641-462b-96ab-def0baf31f6b";
  const BASE = "https://open.faceit.com/data/v4";
  const LEAGUE_ID  = "a14b8616-45b9-4581-8637-4dfd0b5f6af8/18dc2875-1b17-45e0-9e9b-a336ed0aecbb";
  const [loading, setLoading] = useState(false);
  const SEASON_ID  = "18dc2875-1b17-45e0-9e9b-a336ed0aecbb"; // optional
  const SEASON_ID_2 = 50;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const fetchAPI = async () => {
  const response = await axios.get(`https://open.faceit.com/data/v4/players/crspycs/stats/cs2`, {
      headers: { Authorization: `Bearer ${MYKEY}`},
    });
    console.log(response.data);
    //setArray(response);
  }

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
//https://www.faceit.com/api/team-leagues/v2/leagues/a14b8616-45b9-4581-8637-4dfd0b5f6af8/users/bcbcb95c-9155-4e0e-9140-fe44c4105406/teams/active
  const fetchLeague = async () => {
    (async () => {
         try {
           const url = `${BASE}/leagues/${LEAGUE_ID}`;                 // meta
           // const url = `${BASE}/leagues/${LEAGUE_ID}/seasons/${SEASON_ID}`; // season
     
           const { data } = await axios.get(`https://open.faceit.com/data/v4/leagues/a14b8616-45b9-4581-8637-4dfd0b5f6af8`, {
             params: {game: "cs2"},
             headers: { Authorization: `Bearer ${MYKEY}` }
           });
           console.log(data);
         } catch (err) {
           console.error(err);   // 401 bad key, 404 wrong id, etc.
         }
       })();
  }
  async function getCS2Stats(nickname) {
    
    const player_id = await fetchPlayer(nickname);
    
    const { data: stats } = await axios.get(`${BASE}/players/${player_id}/games/cs2/stats`, {
      headers: { Authorization: `Bearer ${MYKEY}`},
    });
    
    console.log(stats);
    return stats;
  }

  // useEffect is a component that runs when the page is rendered
  useEffect(() => {
    //fetchAPI();
    //fetchPlayer("NICKHALDEN");
    //getCS2Stats("crspy");
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleHomePageNick(nickname);
      navigate('/stats');
    } catch (error) {
      console.error('Error fetching stats: ', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1>Faceit Stat Analyzer</h1>
      <form onSubmit={onSubmit}>
        <input 
          className="searchInput"
          name="nickname" 
          type="text" 
          placeholder="NiKo" 
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button className="searchButton" type="submit">Search</button>
      </form>
      <p className="error-message" style={{display: "none"}}>Nickname not found!</p>
      {isLoading && <span class="loader"></span>}
      {/* TODO: Stylize each card
      Maybe make a new page for stats page
      Data analysis: average kills, deaths, assists, ADR
      Expand match fetching: fetch more than 20 matches
      Standardize profile picture*
      
      Figure out API key? Client vs. Server side which one to use
      Hopefully keep this project short, plan to finish by end of week maybe 
      Future project: esea stats clone*/}
    </>
  )
}

export default App
