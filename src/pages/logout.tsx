import { useEffect } from 'react';
import { setIsLoggedIn, setUsername, setEmail } from '../../redux/user'
import { useDispatch } from 'react-redux'
import router from 'next/router';

export default function Home() {
  const dispatch = useDispatch<any>();

  useEffect(() => {
      if (localStorage.getItem('token')) {
        dispatch(setIsLoggedIn(false))
        dispatch(setUsername(''))
        dispatch(setEmail(''))

        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('email')

        router.push('/login')
      }
  }, [])

  return (
    <></>
  )
}
