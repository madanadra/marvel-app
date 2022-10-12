import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import md5 from 'md5';
import moment from 'moment';

const App = () => {
  const [characters, setCharacters] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [load, setLoad] = useState(true)
  const [id, setId] = useState()

  useEffect(() => {
    const marvel = async () => {
      const apiUrl = 'https://gateway.marvel.com/v1/public/characters'
      const publicKey = '0e132ed22c7c47d6a34506f516e9e4ce'
      const privateKey = 'd6c15102fb6e150001287d174d33464b8ec7b160'
      const now = Date.now()
      const hash = md5(now + privateKey + publicKey)

      const result = await fetch(`${apiUrl}?apikey=${publicKey}&ts=${now}&hash=${hash}&limit=30&offset=${page*30}`)
      .then(res => res.json())
      .then(res => res.data.results);

      setCharacters([...characters, ...result]);
      if (result.length === 30) {
        setPage(page + 1);
      } else {
        setLoad(false);
      }
      console.log(result);
    }

    marvel();
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='container'>
      {id != null ? 
        <div className='detail'>
          <h1 className='back' onClick={() => setId()}>Back</h1>
          <img src={`${id.thumbnail.path}.${id.thumbnail.extension}`} alt={id.name} />
          <h1>{id.name}</h1> 
          <h2 className='desc'>{id.description ? id.description : '-'}</h2>
          <h2 className='title'>Comic</h2>
          {id.comics.items.length > 0 ? id.comics.items.map(i => <h2 key={i.resourceURI}>{i.name}</h2>) : <h2>-</h2>}
          <h2 className='title'>Event</h2>
          {id.events.items.length > 0 ? id.events.items.map(i => <h2 key={i.resourceURI}>{i.name}</h2>) : <h2>-</h2>}
          <h2 className='title'>Serie</h2>
          {id.series.items.length > 0 ? id.series.items.map(i => <h2 key={i.resourceURI}>{i.name}</h2>) : <h2>-</h2>}
          <h2 className='title'>Story</h2>
          {id.stories.items.length > 0 ? id.stories.items.map(i => <h2 key={i.resourceURI}>{i.name}</h2>) : <h2>-</h2>}
          <h2 className='title'>URL</h2>
          {id.urls.length > 0 ? id.urls.map(i => <h2 key={i.type}><a href={i.url} target="_blank" rel="noopener noreferrer">{i.type}</a></h2>) : <h2>-</h2>}
          <h2 className='title'>Updated</h2>
          <h2>{id.modified ? moment(id.modified).fromNow() : '-'}</h2>
        </div>
        : 
        <>
          <div className='search'>
            <input type='search' placeholder='Search here...' value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className='list'>
            {characters.filter(m => m.name.toLowerCase().includes(search.toLowerCase())).map(m => 
              <div className='box' key={m.id} onClick={() => {window.scrollTo(0, 0); setId(...characters.filter(character => character.id === m.id))}}>
                <img src={`${m.thumbnail.path}.${m.thumbnail.extension}`} alt={m.name} />
                <h1>{m.name}</h1>
              </div>
            )}
          </div>
          {load && <h2 className='loading'>Loading...</h2> }
        </>
      }
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
