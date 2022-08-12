import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { countries, Country } from 'countries-list'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

interface Props {
  initialCountry?: keyof typeof countries
  backgroundColor?: string
  onChange: (phoneCode: string) => void
}
const perferredCountryCodes = ['ID', 'IN', 'PH', 'US', 'VN']
const CountrySelect = (props: Props) => {
  const defaultCountry: keyof typeof countries = props.initialCountry || 'PH'
  const [selectedIndex, setSelectedIndex] = useState<number>()
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[defaultCountry])

  useEffect(() => {
    onSelectCountry(defaultCountry)
  }, [])

  const getCountryIcon = () => {
    return `${selectedCountry.emoji}`
  }

  const onSelectCountry = (code: keyof typeof countries) => {
    const newCountry = countries[code]
    const oldCountry = { ...selectedCountry }
    if (newCountry) {
      setSelectedCountry(countries[code])
      const el = document.getElementById('countries-select') as HTMLSelectElement
      if (el) {
        el.selectedOptions[0].innerHTML = `+${newCountry.phone}`
        if (selectedIndex) {
          el.options[selectedIndex].innerHTML = parseCountryOption(oldCountry)
        }
        setSelectedIndex(el.selectedIndex)
      }
      props.onChange(newCountry.phone)
    }
  }

  const perferredCountries: Partial<typeof countries> = {}
  const otherCountries: Partial<typeof countries> = {}

  Object.entries(countries).forEach(([code, country]: [keyof typeof countries, Country]) => {
    if (perferredCountryCodes.indexOf(code) > -1) {
      perferredCountries[code] = country
    } else {
      otherCountries[code] = country
    }
  })

  const parseCountryOption = (country: Country) => {
    return `${country.name} +${country.phone}`
  }

  const sortCountryCode = (countryA: Country, countryB: Country) => {
    if (countryA.name < countryB.name) {
      return -1
    }
    if (countryA.name > countryB.name) {
      return 1
    }
    return 0
  }

  return (
    <$InputWrapper background={props.backgroundColor}>
      {getCountryIcon()}
      <$CountrySelect
        id="countries-select"
        defaultValue={defaultCountry}
        onChange={(e) => onSelectCountry(e.target.value as keyof typeof countries)}
        background={props.backgroundColor}
      >
        {Object.entries(perferredCountries)
          .sort(([_, countryA], [__, countryB]) => sortCountryCode(countryA, countryB))
          .map(([code, country]) => (
            <option key={code} value={code}>
              {parseCountryOption(country)}
            </option>
          ))}
        <option disabled>──────────</option>
        {Object.entries(otherCountries)
          .sort(([_, countryA], [__, countryB]) => sortCountryCode(countryA, countryB))
          .map(([code, country]) => (
            <option key={code} value={code}>
              {parseCountryOption(country)}
            </option>
          ))}
      </$CountrySelect>
    </$InputWrapper>
  )
}

const $CountrySelect = styled.select<{ background?: string }>`
  border: none;
  background: ${(props) => props.background || 'none'};
  height: 100%;
  max-width: 60px;
`

const $InputWrapper = styled.span<{ background?: string }>`
  background-color: ${(props) => props.background || `${COLORS.surpressedBackground}1A`};
  border: ${(props) => `${props.background}2f` || `${COLORS.surpressedBackground}3A`} 1px solid;
  border-radius: 10px 0px 0px 10px;
  padding: 5px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  box-sizing: border-box;
  white-space: nowrap;
`

export default CountrySelect
