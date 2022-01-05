import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiUpload } from 'react-icons/fi';

function LesShemas({ data, baseUrl }) {
  const [seriesWithModels, setSeriesWithModels] = useState(() => data);
  const [activeModels, setActiveModels] = useState([]);
  const [activeMachines, setActiveMachines] = useState([]);
  const [activeMachine, setActiveMachine] = useState(null);
  const [alert, setAlert] = useState({ state: false, text: '', color: '' });
  const [schemaName, setSchemaName] = useState('');
  const [dossierPere, setDossierPere] = useState(null);
  const [allDossiers, setAllDossiers] = useState([]);
  const [idsPrevDoss, setIdsPrevDoss] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const FormData = require('form-data');
  const formData = new FormData();

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
    if (e.target.value != -1) {
      try {
        const req = await axios.get(`${baseUrl}/modele/${e.target.value}`);
        const modele = await req.data;
        setActiveMachines(() => modele[0].machines);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleActiveMachine = async e => {
    setActiveMachine(() => e.target.value);
    try {
      const req = await fetch(`${baseUrl}/machine/${e.target.value}/dossiers`);
      const data = await req.json();
      setAllDossiers(prev => [data]);
    } catch (error) {
      console.log(error);
    }
  };
  /*** LA PARTIE CHOISIR DES DOSSIERS ***/
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
  const plusDeDossiers = async e => {
    e.preventDefault();
    try {
      if (activeMachine === null) {
        executeAlert('selectionné la machine active', 'bg-rose-400');
      } else if (dossierPere === null || dossierPere === '') {
        executeAlert('selectionné un dossier', 'bg-rose-400');
      } else {
        const req = await axios.get(
          `${baseUrl}/dossiers?parent=${dossierPere}`
        );
        const res = await req.data;
        if (res.length === 0) {
          executeAlert(
            "Ce dossier ne contien aucun dossier a l'interieur",
            'bg-rose-400'
          );
        } else {
          setIdsPrevDoss(prev => [...prev, dossierPere]);
          setAllDossiers(prev => [...prev, res]);
          setDossierPere(() => null);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  const moinDeDossiers = e => {
    e.preventDefault();
    if (allDossiers.length > 1) {
      setIdsPrevDoss(prev => prev.filter((id, i) => i !== prev.length - 1));
      setDossierPere(() => idsPrevDoss[idsPrevDoss.length - 1]);
      console.log(idsPrevDoss);
      console.log(dossierPere);
      setAllDossiers(prev => {
        return prev.filter((el, i) => i !== prev.length - 1);
      });
    }
  };
  const selectSchema = e => {
    setFile(() => e.target.files[0]);
  };
  const ajouterLeSchema = async e => {
    e.preventDefault();
    if (schemaName === '') {
      executeAlert('Le nom du schema est vide', 'bg-rose-400');
    } else if (activeMachine === null) {
      executeAlert('selectionné la machine active', 'bg-rose-400');
    } else if (file === null) {
      executeAlert('selectionné un fichier pdf', 'bg-rose-400');
    } else if (dossierPere === null) {
      executeAlert('selectionné un dossier', 'bg-rose-400');
    } else {
      formData.append('name', schemaName);
      formData.append('file', file);
      formData.append('dossier_id', dossierPere);
      setIsLoading(() => true);
      try {
        const req = await axios.post(`${baseUrl}/schemas`, formData);
        const res = await req.data;
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
          <div>
            <select onChange={handleActiveMachine}>
              <option>Une machine</option>
              {activeMachines.map(machine => (
                <option value={machine.id} key={machine.id}>
                  {machine.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className='flex'>
        <div className='flex-1'>
          <h4 className='text-center py-1 mb-6 bg-sky-100 mx-4 border-b-4 border-sky-300'>
            Nouvaux schéma
          </h4>
          <form
            className={`px-4 border-r border-gray-300 ${
              isLoading && 'animate-pulse'
            }`}
          >
            <div className='flex justify-between pb-2'>
              <label className='flex-1'>Le nom</label>
              <input
                value={schemaName}
                onChange={e => setSchemaName(() => e.target.value)}
                className='flex-1 border border-gray-500'
              ></input>
            </div>
            <div className='flex justify-between pb-2'>
              <label className='flex-1'>URL</label>
              <input
                type='file'
                id='uploadShema'
                onChange={selectSchema}
                hidden
              ></input>
              <label
                htmlFor='uploadShema'
                className='flex justify-center cursor-pointer items-center flex-1 border border-gray-400 bg-sky-50'
              >
                <FiUpload />
              </label>
            </div>
            <>
              <label className='flex justify-center pb-2'>
                Leur Dossier pére
              </label>

              {allDossiers.map((dossiers, i) => (
                <div key={i} className='flex justify-between pb-2'>
                  <select
                    onChange={e => setDossierPere(() => e.target.value)}
                    className='flex-1 border border-gray-500'
                  >
                    <option></option>
                    {dossiers.map(dossier => (
                      <option
                        value={
                          dossier.dossier ? dossier.dossier.id : dossier.id
                        }
                        key={dossier.dossier ? dossier.dossier.id : dossier.id}
                      >
                        {dossier.dossier ? dossier.dossier.name : dossier.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div className='flex mb-2 justify-center items-center'>
                <button
                  onClick={plusDeDossiers}
                  className='bg-sky-200 px-4 mr-1'
                >
                  Plus
                </button>
                <button
                  onClick={moinDeDossiers}
                  className='bg-sky-200 px-4 ml-1'
                >
                  Moin
                </button>
              </div>
            </>
            <button
              onClick={ajouterLeSchema}
              disabled={isLoading}
              className={`bg-sky-300 w-full p-1 ${
                isLoading && 'cursor-progress'
              }`}
            >
              {isLoading ? 'Processing...' : 'Ajouter le schéma'}
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

export default LesShemas;
