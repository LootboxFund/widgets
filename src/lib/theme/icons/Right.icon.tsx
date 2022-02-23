const RightChevronIcon = ({
  width = 50,
  fill = '#9A9A9A',
  onClick,
}: {
  width?: number
  fill?: string
  onClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void
}) => {
  return (
    <svg
      onClick={onClick}
      width={width}
      height={width}
      viewBox={`0 0 ${width} ${width}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: 'pointer' }}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.9928 1.24162C11.0848 2.78862 2.71375 11.4566 1.20875 16.5506C-1.56125 25.9266 0.391751 33.4016 7.45875 40.4686C17.6938 50.7036 31.8168 50.4856 41.2918 39.9466C50.2588 29.9736 50.2588 17.8956 41.2918 7.92262C34.8198 0.724616 25.4698 -1.74538 15.9928 1.24162ZM27.5018 16.9436L34.4568 23.9526L27.2458 31.1646C21.5388 36.8716 19.7778 38.1196 18.8038 37.1456C17.8308 36.1726 18.8108 34.6656 23.5018 29.9256L29.4298 23.9346L23.5908 18.0336C18.5548 12.9436 17.1568 9.93462 19.8288 9.93462C20.2238 9.93462 23.6768 13.0886 27.5018 16.9436Z"
        fill={fill}
      />
    </svg>
  )
}

export default RightChevronIcon
