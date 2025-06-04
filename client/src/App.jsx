import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Stats from './pages/Stats'
function App() {

  const [count, setCount] = useState(0)
  const [array, setArray] = useState([]);
  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [stats, setStats] = useState([]);
  const MYKEY = "f7f1bb20-0641-462b-96ab-def0baf31f6b";
  const BASE = "https://open.faceit.com/data/v4";

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
    
    //const { data: stats } = await axios.get(`${BASE}/players/${player_id}/stats/cs2`, {
    //  headers: { Authorization: `Bearer ${MYKEY}`},
    //});

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

  const handleHomePageNick = async (nickname) => {
    try {
      const unrefined_stats = await getCS2Stats(nickname);
      setStats(unrefined_stats.items);
      return true;
    }
    catch (error) {
      console.error('Error fetching stats: ', error);
    }
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home handleHomePageNick={handleHomePageNick} />} />
        <Route path="/stats" element={<Stats stats={stats} avatarUrl={avatarUrl} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
