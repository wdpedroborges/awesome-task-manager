import { useQuery } from "react-query"
import { useRouter } from 'next/router'
import { useEffect } from "react"
import { setIsLoggedIn, setUsername, setEmail } from './redux/user'
import { useDispatch } from 'react-redux'
import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// ! Start Line Chart
let options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Amount of completed tasks per day',
    },
  },
};

let lineData = {
  labels: [],
  datasets: [
    {
      label: '#',
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ],
};
// ! End Line Chart

// ! Start Pie Chart
let pieData = {
  labels: ['% Completed', '% Not completed'],
  datasets: [
    {
      label: '# Overall Completeness',
      data: [0, 0],
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)',
        'rgba(255, 99, 132, 0.2)'
      ]
    },
  ],
};
// ! End Pie Chart

export default function Profile() {
    const router = useRouter()
    const dispatch = useDispatch();

    useEffect(() => {
        if (!localStorage.getItem('token'))
            router.push('/logout')
    }, [])

    const loginData = useQuery(
        'loginData',
        async () => {
          const token = localStorage.getItem('token')
          const response = await fetch('/api/login', {
            headers: { 'Authorization': `Bearer ${token}` },
          })

          if (!response.ok)
          router.push('/logout')

          const data = await response.json()

          console.log(data)

          if (data.error) {
            router.push('/logout')
          } else {
            dispatch(setIsLoggedIn(true))
            dispatch(setUsername(data.username))
            dispatch(setEmail(data.email))

            lineData.labels = data.dates
            lineData.datasets[0].data = data.amounts
            pieData.datasets[0].data = [data.totalCompleted, 1 - data.totalCompleted]
          }

          return data
        }
    )

    if (loginData.isLoading) {
        return <div>Loading...</div>
    }

    if (loginData.isError) {
        return <div>{ `${loginData.error}` }</div>
    }

    return (
      <div className="flex flex-col justify-center items-center mt-10">
          <div className="flex flex-col justify-around items-center w-1/2">
              <div className="mb-5"><Line options={options} data={lineData}/></div>
              <div><Pie data={pieData}/></div>
          </div>
      </div>
    )
}
