import axios from 'axios';
import { useEffect, useState } from 'react';
function LesDossiers({ data, baseUrl }) {
  const [seriesWithModels, setSeriesWithModels] = useState(() => data);
  const [activeModels, setActiveModels] = useState([]);
  const [activeMachines, setActiveMachines] = useState([]);
  const [activeMachine, setActiveMachine] = useState(null);
  const [activeDossiers, setActiveDossiers] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [selectedDossiers, setSelectedDossiers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [alert, setAlert] = useState({ state: false, text: '', color: '' });
  const [dossierName, setDossierName] = useState('');
  const [dossierHasChild, setDossierHasChild] = useState(true);
  const [dossierPrinciple, setDossierPrinciple] = useState(true);
  const [dossierPere, setDossierPere] = useState(null);
  const [allDossiers, setAllDossiers] = useState([]);
  const [moinClicked, setMoinClicked] = useState(false);
  const [idsPrevDoss, setIdsPrevDoss] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectAll = () => {
    setDossiers(prev =>
      prev.map(dossier => {
        return {
          ...dossier,
          checked: !selectAll,
        };
      })
    );
    setSelectAll(prev => !prev);
  };
  useEffect(() => {
    // Whenever selectAll state change update selected dossiers:
    setSelectedDossiers(() =>
      dossiers.filter(dossier => dossier.checked == true)
    );
  }, [selectAll]);

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
      setActiveDossiers(() => data);
      setAllDossiers(prev => [data]);
    } catch (error) {
      console.log(error);
    }
  };
  /*** LA PARTIE CHOISIR DES DOSSIERS ***/
  // choisire les dossiers que vous voulez copiée.
  const handleSelectedSerie = e => {
    //choisir dossier
    setSelectedModels(
      () =>
        seriesWithModels.filter(serie => serie.id == e.target.value)[0].modeles
    );
  };
  const handleSelectedModele = async e => {
    const req = await fetch(`${baseUrl}/modele/${e.target.value}`);
    const modele = await req.json();

    setSelectedMachines(() => modele[0].machines);
    // console.log(modele[0].machines);
  };
  const handleSelectedMachine = async e => {
    const req = await fetch(`${baseUrl}/machine/${e.target.value}/dossiers`);
    const data = await req.json();
    // add checked to each folder
    setDossiers(() =>
      data.map(dossier => {
        return {
          ...dossier,
          checked: false,
        };
      })
    );
  };
  const handleSelectedDossier = e => {
    const target = e.target;
    target.checked
      ? setSelectedDossiers(prev => [
          ...prev,
          ...dossiers.filter(dossier => dossier.dossier_id == target.value),
        ])
      : setSelectedDossiers(prev =>
          prev.filter(dossier => dossier.dossier_id != target.value)
        );
    setDossiers(dossiers =>
      dossiers.map(dossier => {
        if (dossier.dossier_id == target.value) {
          dossier = {
            ...dossier,
            checked: !dossier.checked,
          };
        }
        return dossier;
      })
    );
  };
  // button pour le copie des dossiers vers l'active machine.
  const copieDossierToMachine = async () => {
    console.log(selectedDossiers);
    if (activeMachine == null) {
      executeAlert(
        'Choisire la machine dans laquel vous voulez ajoutez ces dossiers.',
        'bg-rose-400'
      );
    } else {
      try {
        const req = await axios.post(`${baseUrl}/machine/dossiers`, {
          activeMachine,
          dossiers: JSON.stringify(selectedDossiers),
        });
        const res = await req.data;
        console.log(res);
      } catch (error) {
        console.log(error);
      } finally {
        setDossiers(() =>
          dossiers.map(dossier => {
            return {
              ...dossier,
              checked: false,
            };
          })
        );
        setSelectedDossiers(() => []);
        setSelectAll(() => false);
        // show alert
        executeAlert('Les dossiers sont copie avec success', 'bg-sky-300');
      }
    }
    //1 get selected folder
    //2 foreach folder selected you have to added to machin_dossiers table
  };
  /*** LA PARTIE NOUVAUX DOSSIERS ***/
  const toggleDossierPrincipal = selectVal => {
    //console.log(selectVal.target.value);
    setDossierPrinciple(() => {
      if (selectVal.target.value === 'true') {
        return true;
      } else if (selectVal.target.value === 'false') {
        return false;
      }
    });
  };
  const getHasChildOption = e => {
    setDossierHasChild(() => (e.target.value === 'true' ? true : false));
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
  const plusDeDossiers = async e => {
    e.preventDefault();
    try {
      if (activeMachine === null) {
        executeAlert('selectionné la machine active', 'bg-rose-400');
      } else if (dossierPere === null || dossierPere === '') {
        executeAlert('selectionné un dossier', 'bg-rose-400');
      } else {
        const req = await axios.get(
          `${baseUrl}/dossiers?parent=${dossierPere}&hasChild=true`
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
  const ajouterLeDossier = async e => {
    e.preventDefault();
    if (dossierName === '') {
      executeAlert('Le nom du dossier est vide', 'bg-rose-400');
    } else if (activeMachine === null) {
      executeAlert('selectionné la machine active', 'bg-rose-400');
    } else {
      setIsLoading(() => true);
      try {
        const reqToDoss = await axios.post(`${baseUrl}/dossiers`, {
          name: dossierName,
          hasChild: dossierHasChild,
          idParent: dossierPere,
        });
        const res = await reqToDoss.data;
        console.log(res);
        if (dossierPere === null) {
          const reqToMachinDoss = await axios.post(
            `${baseUrl}/machine/dossiers`,
            {
              activeMachine,
              dossiers: JSON.stringify([
                {
                  dossier_id: res.id,
                },
              ]),
            }
          );
          const resMachinDoss = await reqToMachinDoss.data;
          console.log(resMachinDoss);
        }
      } catch (error) {
        console.log(error);
      } finally {
        executeAlert('Le dossier a été crée avec succes.', 'bg-sky-400');
        setIsLoading(() => false);
      }
    }
  };

  return (
    <div>
      {/* Pour choisire la machine active */}

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
      <div className='flex py-2'>
        {/* Pour nouvaux dossiers */}
        <div className='flex-1'>
          <h4 className='text-center py-1 mb-6 bg-sky-100 mx-4 border-b-4 border-sky-300'>
            Nouvaux dossiers
          </h4>
          <form className='px-4 border-r border-gray-300 '>
            <div className='flex justify-between pb-2'>
              <label className='flex-1'>Le nom</label>
              <input
                value={dossierName}
                onChange={e => setDossierName(() => e.target.value)}
                className='flex-1 border border-gray-500'
              ></input>
            </div>
            <div className='flex justify-between pb-2'>
              <label className='flex-1'>Contiens d'autre dossiers</label>
              <select
                onChange={getHasChildOption}
                className='flex-1 border border-gray-500'
              >
                <option value={true}>Oui</option>
                <option value={false}>Non</option>
              </select>
            </div>
            <div className='flex justify-between pb-2'>
              <label className='flex-1'>Dossier pricipal</label>
              <select
                onChange={toggleDossierPrincipal}
                className='flex-1 border border-gray-500'
              >
                <option value={true}>Oui</option>
                <option value={false}>Non</option>
              </select>
            </div>
            {!dossierPrinciple && (
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
                          key={
                            dossier.dossier ? dossier.dossier.id : dossier.id
                          }
                        >
                          {dossier.dossier
                            ? dossier.dossier.name
                            : dossier.name}
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
            )}
            <button
              onClick={ajouterLeDossier}
              disabled={isLoading}
              className='bg-sky-300 w-full p-1'
            >
              {isLoading ? 'Processing...' : 'Ajouter le dossier'}
            </button>
          </form>
        </div>
        {/* Pour choisire dossiers */}
        <div className='flex-1'>
          <h4 className='text-center py-1 mb-6 bg-sky-100 mx-4 border-b-4 border-sky-300'>
            Choisire dossiers
          </h4>
          <div className='flex flex-1 justify-between mx-4 mb-2 pb-2 border-b border-gray-300'>
            <div>
              <select onChange={handleSelectedSerie}>
                <option>Une serie</option>
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
              <select onChange={handleSelectedModele}>
                <option>Un modele</option>
                {selectedModels.map(modele => {
                  return (
                    <option value={modele.id} key={modele.id}>
                      {modele.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <select onChange={handleSelectedMachine}>
                <option>Une machine</option>
                {selectedMachines.map(machine => {
                  return (
                    <option value={machine.id} key={machine.id}>
                      {machine.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className='mx-5'>
            <div className='flex items-center pl-4 pb-1 mb-2 border-b border-gray-300'>
              <input
                onChange={handleSelectAll}
                className='mr-2'
                checked={selectAll}
                type='checkbox'
              ></input>
              <p>Selectionné tous</p>
            </div>
            {dossiers.map(dossier => {
              return (
                <div
                  key={dossier.dossier_id}
                  className='flex items-center pl-6 pb-1'
                >
                  <input
                    value={dossier.dossier_id}
                    onChange={handleSelectedDossier}
                    checked={dossier.checked}
                    className='mr-2'
                    type='checkbox'
                  ></input>
                  <p>{dossier.dossier.name}</p>
                </div>
              );
            })}

            <button
              onClick={copieDossierToMachine}
              disabled={isLoading}
              className='bg-sky-300 w-full p-1'
            >
              Choisire les dossier
            </button>
          </div>
        </div>
      </div>
      {alert.state && (
        <div
          className={`absolute w-1/3 h-14 rounded-xl bottom-10 left-8 flex justify-center items-center ${alert.color}`}
        >
          <p className='text-gray-100'>{alert.text}</p>
        </div>
      )}
    </div>
  );
}

export default LesDossiers;
