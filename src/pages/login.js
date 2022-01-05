import axios from 'axios';
import { useEffect, useState } from 'react';
import user from './user.png';
import { useContext } from 'react';
import { Context } from '../components/AuthContext';
import { render } from 'react-dom';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({ state: false, text: '', color: '' });
  const [unError, setUnError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const { setAdmin } = useContext(Context);
  let navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;

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

  const loginUser = async e => {
    e.preventDefault();
    if (username === '' || password == '') {
      setUnError(() => true);
      setPwError(() => true);
    } else {
      try {
        const req = await axios.post(`${baseUrl}/login/admin`, {
          username,
          password,
        });
        const res = await req.data;
        console.log(res);
        if (res.success) {
          executeAlert(res.msg, 'bg-green-400');
          setAdmin(() => {
            return {
              state: true,
              user: {
                name: 'admin',
              },
            };
          });
          localStorage.setItem('un', btoa(username));
          localStorage.setItem('pw', btoa(password));
          navigate('/');
        } else {
          executeAlert(res.msg, 'bg-rose-500');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className='w-screen h-screen flex items-center justify-center bg-sky-300 min-h-screen'>
      <div className='w-2/5 h-2/5 p-4 shadow-cyan-500/50 bg-white rounded min-h-max'>
        <form className='flex items-center flex-col'>
          <div className='flex items-center justify-center mb-2'>
            <img className='h-20' src={user} />
          </div>
          <div className='text-center text-3xl font-light my-2 mb-4'>
            Bimmapro
          </div>
          <div className='w-4/5 m-auto mb-2 h-10'>
            <input
              value={username}
              onChange={e => setUsername(() => e.target.value)}
              className={`${
                unError && 'border-rose-500 placeholder:text-rose-500'
              } w-full h-full pl-1 outline-none border-2 focus:border-sky-200 placeholder:focus:text-gray-400`}
              placeholder='username'
            />
          </div>
          <div className='w-4/5 m-auto mb-2 h-10'>
            <input
              value={password}
              onChange={e => setPassword(() => e.target.value)}
              className={`${
                pwError && 'border-rose-500 placeholder:text-rose-500'
              } w-full h-full pl-1 outline-none border-2 focus:border-sky-200 placeholder:focus:text-gray-400`}
              placeholder='password'
              type='password'
            />
          </div>
          <div className='w-full flex justify-center h-10'>
            <button
              onClick={loginUser}
              className='w-4/5 h-full border p-1 hover:bg-sky-300 hover:text-gray-100'
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
      {alert.state && (
        <div
          className={`absolute ml-auto mr-auto w-max px-2 h-14 rounded-xl top-40 flex justify-center items-center ${alert.color}`}
        >
          <p className='text-gray-100'>{alert.text}</p>
        </div>
      )}
    </div>
  );
}
