import react from 'react'
import styled from 'styled-components'

export interface TemplateProps {}
const Template = (props: TemplateProps) => {
	return (
		<$Template>
			<p>Template</p>
		</$Template>
	)
}

const $Template = styled.div<{}>``

export default Template;