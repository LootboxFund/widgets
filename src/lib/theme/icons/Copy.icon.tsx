import { useState } from 'react'

const CopyIcon = ({
  width = 50,
  text,
  fill = '#E5E5E5',
  tipID,
  smallWidth,
}: {
  width?: number
  text: string
  fill?: string
  tipID?: string
  smallWidth?: number | string
}) => {
  const [color, setColor] = useState(fill)
  return (
    <svg
      width={smallWidth || width}
      height={smallWidth || width}
      viewBox={`0 0 ${width} ${width}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginLeft: '5px', cursor: 'pointer' }}
      data-tip
      data-for={tipID}
      onClick={() => {
        navigator.clipboard.writeText(text)
        setColor('#464646')
        setTimeout(() => {
          setColor(fill)
        }, 100)
      }}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.20383 0.984C7.82481 2.36816 7.82481 30.4318 9.20383 31.816C10.5722 33.1895 33.6512 33.1895 35.0197 31.816C35.6781 31.1551 36 27.4462 36 20.5172V10.2024L30.872 5.10122L25.7439 0H17.9641C13.0027 0 9.8288 0.3567 9.20383 0.984ZM29.8279 11.3299C25.2039 11.7317 24.5626 11.1823 24.5626 6.82158V2.9315L28.6882 7.00116L32.8139 11.07L29.8279 11.3299ZM1.03427 9.184C-0.344756 10.5682 -0.344756 38.6318 1.03427 40.016C1.70744 40.6917 5.75464 41 13.9422 41C26.2611 41 27.8304 40.6105 27.8304 37.556C27.8304 36.2202 26.9367 36.08 18.3987 36.08C9.47343 36.08 8.85826 35.9718 6.96128 34.0669C5.01529 32.1145 4.95566 31.6971 4.95566 20.1269C4.95566 9.1881 4.83393 8.2 3.48514 8.2C2.67635 8.2 1.57346 8.6428 1.03427 9.184Z"
        fill={color}
      />
    </svg>
  )
}

export default CopyIcon
