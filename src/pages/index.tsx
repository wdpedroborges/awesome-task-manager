import { useEffect } from 'react';
import { setIsLoggedIn, setUsername, setEmail } from '../../redux/user'
import { useDispatch } from 'react-redux'
import Hero from './components/Hero';

export default function Home() {
  const dispatch = useDispatch<any>();

  useEffect(() => {
      if (localStorage.getItem('token')) {
        dispatch(setIsLoggedIn(true))
        dispatch(setUsername(`${localStorage.getItem('username')}`))
        dispatch(setEmail(`${localStorage.getItem('email')}`))
      }
  }, [])

  return (
    <main
      className='min-h-screen'
    >
      <Hero/>
    </main>
  )
}

