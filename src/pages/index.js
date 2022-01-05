import { useContext, useEffect, useState } from 'react';
import About from '../components/About';
import { Context } from '../components/AuthContext';
import LesDossiers from '../components/LesDossiers';
import LesMachines from '../components/LesMachines';
import LesModeles from '../components/LesModeles';
import LesSeries from '../components/LesSeries';
import LesShemas from '../components/LesShemas';
import './home.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [dossiers, setDossiers] = useState(false);
  const [shemas, setShemas] = useState(false);
  const [machines, setMachines] = useState(false);
  const [modeles, setModeles] = useState(false);
  const [series, setSeries] = useState(false);
  const [about, setAbout] = useState(true);
  const [data, setData] = useState([]);
  const { admin } = useContext(Context);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  let navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('un') && localStorage.getItem('pw')) {
      const username = localStorage.getItem('un');
      const password = localStorage.getItem('pw');
      if (
        'bimmapro.online' !== atob(username) ||
        'App719068917869' !== atob(password)
      ) {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, []);
  const getSeries = async () => {
    try {
      const req = await fetch(`${baseUrl}/series`);
      const res = await req.json();
      setData(() => res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSeries();
  }, []);
  const handleDossiersSec = () => {
    setDossiers(() => true);
    setShemas(() => false);
    setMachines(() => false);
    setModeles(() => false);
    setSeries(() => false);
    setAbout(() => false);
  };
  const handleShemasSec = () => {
    setShemas(() => true);
    setDossiers(() => false);
    setMachines(() => false);
    setModeles(() => false);
    setSeries(() => false);
    setAbout(() => false);
  };
  const handleMachinesSec = () => {
    setMachines(() => true);
    setShemas(() => false);
    setDossiers(() => false);
    setModeles(() => false);
    setSeries(() => false);
    setAbout(() => false);
  };
  const handleModelesSec = () => {
    setModeles(() => true);
    setMachines(() => false);
    setShemas(() => false);
    setDossiers(() => false);
    setSeries(() => false);
    setAbout(() => false);
  };
  const handleSeriesSec = () => {
    setSeries(() => true);
    setModeles(() => false);
    setMachines(() => false);
    setShemas(() => false);
    setDossiers(() => false);
    setAbout(() => false);
  };
  const handleAboutSec = () => {
    setAbout(() => true);
    setSeries(() => false);
    setModeles(() => false);
    setMachines(() => false);
    setShemas(() => false);
    setDossiers(() => false);
  };

  return (
    <div className='container'>
      <div className='flex'>
        {/* side section */}
        <section className='side'>
          <div className='text-center py-2 bg-sky-300 mb-1'>Section</div>
          <div
            onClick={handleSeriesSec}
            className='bg-sky-200 hover:bg-sky-300 py-4 text-center mb-1 cursor-pointer'
          >
            Les series
          </div>
          <div
            onClick={handleModelesSec}
            className='bg-sky-200 hover:bg-sky-300 py-4 text-center mb-1 cursor-pointer'
          >
            Les modeles
          </div>
          <div
            onClick={handleMachinesSec}
            className='bg-sky-200 hover:bg-sky-300 py-4 text-center mb-1 cursor-pointer'
          >
            les machines
          </div>
          <div
            onClick={handleDossiersSec}
            className='bg-sky-200 hover:bg-sky-300 py-4 text-center mb-1 cursor-pointer'
          >
            Les dossiers
          </div>
          <div
            onClick={handleShemasSec}
            className='bg-sky-200 hover:bg-sky-300 py-4 text-center mb-1 cursor-pointer'
          >
            Les schémas
          </div>
          <div
            onClick={handleAboutSec}
            className='bg-sky-200 hover:bg-sky-300 py-4 text-center mb-1 cursor-pointer'
          >
            About
          </div>
        </section>
        {/* main section*/}
        <section className='main'>
          <div className='text-center py-2 bg-sky-300 border-l-4 border-white mb-1'>
            Setting
          </div>
          {dossiers && <LesDossiers data={data} baseUrl={baseUrl} />}
          {shemas && <LesShemas data={data} baseUrl={baseUrl} />}
          {machines && <LesMachines data={data} baseUrl={baseUrl} />}
          {modeles && <LesModeles data={data} baseUrl={baseUrl} />}
          {series && <LesSeries data={data} baseUrl={baseUrl} />}
          {about && <About data={data} baseUrl={baseUrl} />}
        </section>
      </div>
    </div>
  );
}
