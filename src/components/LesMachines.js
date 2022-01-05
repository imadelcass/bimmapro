import axios from 'axios';
import { useEffect, useState } from 'react';

function LesMachines({ data, baseUrl }) {
  const [seriesWithModels, setSeriesWithModels] = useState(() => data);
  const [activeModels, setActiveModels] = useState([]);
  const [activeModele, setActiveModele] = useState(null);
  const [alert, setAlert] = useState({ state: false, text: '', color: '' });
  const [machineName, setMachineName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // choisir la serie et le modele el la machine.
  const handleActiveSerie = e => {
    // update modeles with the selected serie
    if (e.target.value != -1) {
      setActiveModels(
        () =>
          seriesWithModels.filter(serie => serie.id == e.target.value)[0]
            .modeles
      );
    }
  };
  const handleActiveModele = async e => {
    setActiveModele(() => (e.target.value == -1 ? null : e.target.value));
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
  const ajouterLaMachine = async e => {
    e.preventDefault();
    if (machineName === '') {
      executeAlert('Le nom du machine est vide', 'bg-rose-400');
    } else if (activeModele === null) {
      executeAlert('selectionné la modele active', 'bg-rose-400');
    } else {
      console.log(activeModele);
      console.log(machineName);
      setIsLoading(() => true);
      try {
        const req = await axios.post(`${baseUrl}/machines`, {
          activeModele,
          machineName,
        });
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
              {seriesWithModels.map(serie => {
                return (
                  <option value={serie.id} key={serie.id}>
                    {serie.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <select onChange={handleActiveModele}>
              <option value={-1}>Un modele</option>
              {activeModels.map(modele => (
                <option value={modele.id} key={modele.id}>
                  {modele.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className='flex h-56'>
        <div className='flex-1 min-h-full'>
          <h4 className='text-center py-1 mb-10 bg-sky-100 mx-4 border-b-4 border-sky-300'>
            Nouvaux machine
          </h4>
          <form
            className={`px-4 border-r border-gray-300 ${
              isLoading && 'animate-pulse'
            }`}
          >
            <div className='flex justify-between pb-2 mb-10'>
              <label className='flex-1'>Le nom</label>
              <input
                value={machineName}
                onChange={e => setMachineName(() => e.target.value)}
                className='flex-1 border border-gray-500'
              ></input>
            </div>
            <button
              onClick={ajouterLaMachine}
              disabled={isLoading}
              className={`bg-sky-300 w-full p-1 ${
                isLoading && 'cursor-progress'
              }`}
            >
              {isLoading ? 'Processing...' : 'Ajouter la machine'}
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

export default LesMachines;
