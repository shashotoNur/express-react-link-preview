
import React, { useState } from 'react';
import axios from 'axios';

const LinkPreview = () =>
  {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState([]);

    const handleSubmit = async (event) =>
      {
        event.preventDefault();
        setLoading(true);

        const res = await axios.post(`http://localhost:5000/preview`, { text });
        const data = res?.data;
        console.log(data);
        
        setLinks(data);
        setLoading(false);
      };

    const PreviewCard = ({ linkData }) =>
      {
        return (
          <a className="preview" href={ linkData.url }>
            <img alt="preview" src={ linkData.image } />
            <div>
              <h4>{ linkData.title }</h4>
              <p>{ linkData.description }</p>
            </div>
          </a>
        )
      };

    return (
      <>
        <h1>Get Links Preview</h1>

        <form onSubmit={ handleSubmit }>
          <textarea rows="4" cols="50" type="text" 
            value={ text } onChange={ (event) => setText(event.target.value) }>
          </textarea>
          <br />

          <input type="submit" value="Submit" />
        </form>

        <h2>Preview</h2>

        { loading &&  <h3>Fetching link previews...</h3> }
        { links.map(obj => <PreviewCard key={obj.url} linkData={obj} />) }
      </>
    )
  };

export default LinkPreview;