import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';

function About({ baseUrl }) {
  const [alert, setAlert] = useState({ state: false, text: '', color: '' });
  const [isLoading, setIsLoading] = useState(false);

  const [version, setVersion] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [info, setInfo] = useState('');

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
  const getAboutInfo = async () => {
    try {
      const req = await axios.get(`${baseUrl}/about`);
      const res = await req.data;
      const {
        version: versionAbout,
        date: dateAbout,
        email: emailAbout,
        info: infoAbout,
      } = res[0];
      setVersion(() => versionAbout);
      setEmail(() => emailAbout);
      setInfo(() => infoAbout);
      setDate(() => dateAbout);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAboutInfo();
  }, []);

  const modifierAbout = async e => {
    e.preventDefault();
    let customDate = moment(date).format('MMM Do YY');
    if (version === '' || email === '' || date === '' || info === '') {
      executeAlert('Un champ est vide', 'bg-rose-400');
    } else {
      setIsLoading(() => true);
      try {
        const req = await axios.put(`${baseUrl}/about`, {
          version,
          email,
          customDate,
          info,
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
      <div className='p-4 mb-4 mx-4 flex justify-center'></div>
      <div className='flex h-56'>
        <div className='flex-1 min-h-full'>
          <h4 className='text-center py-1 mb-10 bg-sky-100 mx-4 border-b-4 border-sky-300'>
            Modifier about page
          </h4>
          <form
            className={`px-4 border-r border-gray-300 ${
              isLoading && 'animate-pulse'
            }`}
          >
            <div className='flex justify-between pb-2 mb-1'>
              <label className='flex-1'>Version</label>
              <input
                value={version}
                onChange={e => setVersion(() => e.target.value)}
                className='flex-1 border border-gray-500'
              ></input>
            </div>
            <div className='flex justify-between pb-2 mb-1'>
              <label className='flex-1'>email</label>
              <input
                value={email}
                type='email'
                onChange={e => setEmail(() => e.target.value)}
                className='flex-1 border border-gray-500'
              ></input>
            </div>
            <div className='flex justify-between pb-2 mb-1'>
              <label className='flex-1'>date de publication</label>
              <input
                value={date}
                type='date'
                onChange={e => setDate(() => e.target.value)}
                className='flex-1 border border-gray-500'
              ></input>
            </div>
            <div className='flex justify-between pb-2 mb-1'>
              <label className='flex-1'>info</label>
              <textarea
                value={info}
                onChange={e => setInfo(() => e.target.value)}
                className='flex-1 border border-gray-500'
              ></textarea>
            </div>
            <button
              onClick={modifierAbout}
              disabled={isLoading}
              className={`bg-sky-300 w-full p-1 ${
                isLoading && 'cursor-progress'
              }`}
            >
              {isLoading ? 'Processing...' : "Modifier l'about"}
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

export default About;
