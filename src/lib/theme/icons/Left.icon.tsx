const LeftChevronIcon = ({
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
        d="M32.0242 1.24162C36.9322 2.78862 45.3032 11.4566 46.8082 16.5506C49.5782 25.9266 47.6252 33.4016 40.5582 40.4686C30.3232 50.7036 16.2002 50.4856 6.72525 39.9466C-2.24175 29.9736 -2.24175 17.8956 6.72525 7.92262C13.1972 0.724616 22.5472 -1.74538 32.0242 1.24162ZM20.5152 16.9436L13.5602 23.9526L20.7712 31.1646C26.4782 36.8716 28.2392 38.1196 29.2132 37.1456C30.1862 36.1726 29.2062 34.6656 24.5152 29.9256L18.5872 23.9346L24.4262 18.0336C29.4622 12.9436 30.8602 9.93462 28.1882 9.93462C27.7932 9.93462 24.3402 13.0886 20.5152 16.9436Z"
        fill={fill}
      />
    </svg>
  )
}

export default LeftChevronIcon
