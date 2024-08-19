/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, useState} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../assets/ts/_utils'
import {useThemeMode} from '../../layout/theme-mode/ThemeModeProvider'
import { getDashboardCount } from './core/_requests'
import moment from 'moment'

type Props = {
  className: string
  chartColor: string
  chartHeight: string
}

const MixedWidget11: React.FC<Props> = ({className, chartColor, chartHeight}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [campaignDetails, setCampaignDetails] = useState<any[]>([]);


  const chartValues = async () => {
    const response = await getDashboardCount(fromDate, toDate)
    setCampaignDetails(response.output);    
  }

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartColor, chartHeight, campaignDetails))
    if (chart) {
      chart.render()
    }

    return chart
  }

  useEffect(() => {
    chartValues();
  }, [fromDate, toDate]);

  useEffect(() => {
    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, mode, campaignDetails])

  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      <div className='card-body p-0 d-flex justify-content-between flex-column overflow-hidden'>
        {/* begin::Hidden */}
        <div className='d-flex flex-stack flex-wrap flex-grow-1 px-9 pt-9 pb-3'>
          <div className='me-2'>
            <span className='fw-bold text-gray-800 d-block fs-3'>Campaigns</span>

            {fromDate && <span className='text-gray-400 fw-semibold'>{moment(fromDate).format('DD-MMMM-YYYY')} - {toDate ? moment(toDate).format('DD-MMMM-YYYY') : 'till now'}</span>}
          </div>

          {/* <div className={`fw-bold fs-3`}>$15,300</div> */}
          <div className='d-flex'>
            <input type='date' max={moment().format('YYYY-MM-DD')} className='form-control form-control-sm mw-200px me-3' onChange={(e) => setFromDate(e.target.value)} />
            {fromDate && <input type='date' min={fromDate} className='form-control form-control-sm mw-200px' onChange={(e) => setToDate(e.target.value)} />}
          </div>
        </div>
        {/* end::Hidden */}

        {/* begin::Chart */}
        <div ref={chartRef} className='mixed-widget-10-chart'></div>
        {/* end::Chart */}
      </div>
    </div>
  )
}

const chartOptions = (chartColor: string, chartHeight: string, chartData:any): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')
  const secondaryColor = getCSSVariableValue('--bs-gray-300')
  const baseColor = getCSSVariableValue('--bs-' + chartColor)

  const count = chartData.map((cot:any) => cot.count);
  const labels = chartData.map((cot:any) => cot.campaign_name);


  console.log("erjhweiurhwigrweg", chartData, count, labels);
  

  return {
    series: [
      {
        name: 'Total Registrtions',
        data: count,
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: chartHeight,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 5,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: labels,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      type: 'solid',
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return val + ' Registrations'
        },
      },
    },
    colors: ['#3fa7b9', secondaryColor],
    grid: {
      padding: {
        top: 10,
      },
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  }
}

export {MixedWidget11}
