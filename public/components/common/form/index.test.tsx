import React from 'react';
import { render, screen } from '@testing-library/react';
import { InputForm } from './index';
import { useForm } from './hooks';

jest.mock('../../../../../../node_modules/@elastic/eui/lib/services/accessibility', () => ({
	htmlIdGenerator: () => () => 'generated-id',
}));

describe('[component] InputForm', () => {
	it.each`
		inputType | value | options | rest
		${'editor'} | ${'{}'} | ${{editor: {language: 'json'}}} | ${{}}
		${'number'} | ${4} | ${undefined} | ${{}}
		${'select'} | ${'value1'} | ${{select: [{text: 'Label1', value: 'value1'}, {text: 'Label2', value: 'value2'}]}}} | ${{}}
		${'switch'} | ${true} | ${{switch: {values: {enabled: {label: 'Enabled', value: true}, disabled: {label: 'Disabled', value: false}}}}} | ${{}}
		${'text'} | ${'test'} | ${undefined} | ${{isInvalid: false}}
		${'textarea'} | ${'test'} | ${undefined} | ${{}}
	`('Renders correctly to match the snapshot. Input: $inputType', ({ inputType, value, options }) => {
		const wrapper = render(
			<InputForm
				type={inputType}
				value={value}
				onChange={() => {}}
				options={options}
			/>
		);
		expect(wrapper.container).toMatchSnapshot();
	});

	it.each`
		inputType | initialValue | options | rest
		${'number'} | ${4} | ${{number: {min: 5}}} | ${{ validate: (value) => value > 3 ? undefined : 'Vaidation error: value is lower than 5'}}
		${'text'} | ${''} | ${undefined} | ${{ validate: (value) => value.length ? undefined : 'Validation error: string can not be empty' }}
		${'text'} | ${'test spaces'} | ${undefined} | ${{ validate: (value) => value.length ? undefined : 'Validation error: string can not contain spaces' }}
	`('Renders correctly to match the snapshot with validation errors. Input: $inputType', async ({ inputType, initialValue, options, rest }) => {
		const TestComponent = () => {
			const { fields: { [inputType]: field } } = useForm({ [inputType]: { initialValue, type: inputType, options, ...rest } });
			return (
				<InputForm
					label={'Test'}
					{...field}
				/>
			);
		};
		const wrapper = render(<TestComponent />);
		expect(wrapper.container).toMatchSnapshot();
	});
});

