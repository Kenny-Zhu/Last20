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
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleHomePageNick(nickname);
    if (success) {
      navigate('/stats');
    }
    else {
      document.querySelector(".error-message").style.display = "block";
    }
  }

  return (
    <>
      <h1>Faceit Stat Analyzer</h1>
      <form onSubmit={handleSubmit}>
        <input 
          name="nickname" 
          type="text" 
          placeholder="NiKo" 
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <p className="error-message" style={{display: "none"}}>Nickname not found!</p>
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
