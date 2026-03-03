'use client'
import { getTransactionsBySelectedMonth } from '@/actions/assignment.action'
import { useProfileInfoHook } from '@/hooks/useProfileinfo'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Area, CartesianGrid, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, AreaChart, BarChart, Bar } from 'recharts'


const barda = [
  { price: '1', date: 4000 },
]
const EarningsPage = () => {
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [monthData, setMonthData] = useState<any[]>([])
  const [barData, setBarData] = useState<any[]>([])

  const { data } = useQuery({
    queryKey: ['trackerDataMonth', selectedMonth, selectedYear],
    queryFn: async () => {
      const res = await getTransactionsBySelectedMonth(selectedMonth, selectedYear)
      return res
    }
  })

  useEffect(() => {
    if (data) {
      const r = data && data.data.reduce((acc, curr) => {
        acc.completed += 1;

        const date = moment(curr.expectedDate).format("DD-MM-YYYY");
        const existing = acc.data.find((item) => item.date === date);

        if (existing) {
          existing.price += curr.price;
        } else {
          acc.data.push({ date, price: curr.price });
        }

        return acc;
      }, { completed: 0, data: [] });

      setBarData(r)

      console.log("r is =>>", r);
    }

  }, [data])
  return (
    <div className=' w-full px-10 max-md:px-4 pb-20 '>
      <h1 className=' text-2xl font-bold'> Earnings </h1>


      <div className="flex  w-[90%] max-md:w-full   justify-between items-center py-4">
        <h2 className="text-3xl max-md:lg font-bold">
          {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', })}{' '}
          {selectedYear}
        </h2>
      </div>

      <div className='flex gap-2 items-center'>
        <select
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          value={selectedMonth}
          name="month"
          className="border bordercolor rounded-xl p-2"
        >
          {Array.from({ length: 12 }, (_, i) => {
            const monthName = new Date(0, i).toLocaleString('default', {
              month: 'long',
            })
            return (
              <option key={i} value={i}>
                {monthName}
              </option>
            )
          })}
        </select>

        <select
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          value={selectedYear}
          name="year"
          className="border bordercolor rounded-xl p-2"
        >
          {Array.from({ length: 6 }, (_, i) => {
            const year = now.getFullYear() - 5 + i
            return (
              <option key={year} value={year}>
                {year}
              </option>
            )
          })}
        </select>
      </div>

      <div className=' card bordercolor rounded-2xl p-5 my-5 flex flex-col gap-5 '>
        <div className='between  '><p>Earnings in {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', })}{' '}</p>
          <span>₹ {barData?.data?.reduce((acc, curr) => { acc = acc + curr.price; return acc }, 0)} </span></div>

        <div className='between border-t border-[#ffffff37] pt-3 '><p>Completed assignment</p>
          <span>{barData?.completed} </span>
          </div>
      </div>


      <div className=' w-full h-[400px] border bordercolor rounded-3xl mb-4 card p-2 px-4'>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart width={1200} height={400} data={barData.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colordebit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#23D824" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#23D824" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#ffffff28" />
            <YAxis />
            <Legend align="center" verticalAlign="top" wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }} />
            <CartesianGrid strokeDasharray="1 1" stroke="#ffffff28" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff20',
                color: 'white',
                borderRadius: '5px',
                backdropFilter: 'blur(10px)',
                border: '1px solid transparent',
              }}
              itemStyle={{
                color: '#E11D47',
                fontWeight: 'bold',
                fontSize: '15px',
              }} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#23D824"
              fillOpacity={0.2}
              fill="url(#colordebit)"
              stackId="2"
              dot={{ fill: '#23D824', strokeWidth: 1, r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>


    </div>
  )
}

export default EarningsPage