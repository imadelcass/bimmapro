import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiUpload } from 'react-icons/fi';

function LesModeles({ data, baseUrl }) {
  const [series, setSeries] = useState(() => data);
  const [alert, setAlert] = useState({ state: false, text: '', color: '' });
  const [modeleName, setModeleName] = useState('');
  const [modeleYear, setModeleYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSerie, setActiveSerie] = useState(-1);
  const [file, setFile] = useState(null);
  const FormData = require('form-data');
  const formData = new FormData();
  // choisir la serie et le modele el la machine.
  const handleActiveSerie = e => {
    setActiveSerie(() => e.target.value);
  };
  const executeAlert = (text, color) => {
    setAlert(() => {
      return { state: true, text, color };
    });
    setTimeout(() => {
      setAlert(prev => {
        return { ...prev, state: false };
      });
    }, 3000);
  };
  const selectModeleImg = e => {
    setFile(() => e.target.files[0]);
  };
  const ajouterLeModele = async e => {
    e.preventDefault();
    if (modeleName === '') {
      executeAlert('Le nom du modele est vide', 'bg-rose-400');
    } else if (activeSerie == -1) {
      executeAlert('selectionné la serie active', 'bg-rose-400');
    } else if (isNaN(parseInt(modeleYear))) {
      executeAlert("L'année est pas valid", 'bg-rose-400');
    } else {
      formData.append('file', file);
      formData.append('modeleName', modeleName);
      formData.append('activeSerie', activeSerie);
      formData.append('modeleYear', modeleYear);
      setIsLoading(() => true);
      try {
        const req = await axios.post(`${baseUrl}/modeles`, formData);
        const res = await req.data;
        console.log(res);
          if (res.success) {
            executeAlert(res.msg, 'bg-sky-400');
          } else {
            executeAlert(res.msg, 'bg-rose-400');
          }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(() => false);
      }
    }
  };
  return (
    <div>
      <div className='p-4 mb-4 mx-4 flex border-b border-gray-300'>
        <h4>Choisire :</h4>
        <div className='flex flex-1 justify-around'>
          <div>
            <select onChange={handleActiveSerie}>
              <option value={-1}>Une serie</option>
              {series.map(serie => {
                return (
                  <option value={serie.id} key={serie.id}>
                    {serie.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      <div className='flex h-56'>
        <div className='flex-1 min-h-full'>
          <h4 className='text-center py-1 mb-10 bg-sky-100 mx-4 border-b-4 border-sky-300'>
            Nouvaux modele
          </h4>
          <form
            className={`px-4 border-r border-gray-300 ${
              isLoading && 'animate-pulse'
            }`}
          >
            <div className='flex justify-between pb-2 mb-1'>
              <label className='flex-1'>Le nom</label>
              <input
                value={modeleName}
                onChange={e => setModeleName(() => e.target.value)}
                className='flex-1 border border-gray-500'
              ></input>
            </div>
            <div className='flex justify-between pb-2 mb-1'>
              <label className='flex-1'>L'année</label>
              <input
                value={modeleYear}
                onChange={e => setModeleYear(() => e.target.value)}
                className='flex-1 border border-gray-500'
              ></input>
            </div>
            <div className='flex justify-between pb-2'>
              <label className='flex-1'>URL</label>
              <input
                type='file'
                id='uploadShema'
                onChange={selectModeleImg}
                hidden
              ></input>
              <label
                htmlFor='uploadShema'
                className='flex justify-center cursor-pointer items-center flex-1 border border-gray-400 bg-sky-50'
              >
                <FiUpload />
              </label>
            </div>
            <button
              onClick={ajouterLeModele}
              disabled={isLoading}
              className={`bg-sky-300 w-full p-1 ${
                isLoading && 'cursor-progress'
              }`}
            >
              {isLoading ? 'Processing...' : 'Ajouter le modele'}
            </button>
          </form>
        </div>
        <div className='flex-1'></div>
      </div>

      {alert.state && (
        <div
          className={`absolute w-max px-2 h-14 rounded-xl bottom-10 left-8 flex justify-center items-center ${alert.color}`}
        >
          <p className='text-gray-100'>{alert.text}</p>
        </div>
      )}
    </div>
  );
}

export default LesModeles;
