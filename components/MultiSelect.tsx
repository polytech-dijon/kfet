import Select, { components } from 'react-select'
import type { GroupBase, Props, StylesConfig } from 'react-select'

export type SelectOption<T> = {
  label: string;
  value: T;
}

export type MultiSelectProps<T> = {
  options: SelectOption<T>[];
  defaultValue?: T[];
}
export default function MultiSelect<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
  const customStyles: StylesConfig<Option, IsMulti, Group> = {
    container: (provided, state) => ({
      ...provided,
      fontSize: '0.875rem',
    }),
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? '1px solid rgb(59 130 246)' : '1px solid rgb(209 213 219)',
      borderRadius: '0.5rem',
      backgroundColor: 'rgb(249 250 251)',
      ":hover": {
        border: state.isFocused ? '1px solid rgb(59 130 246)' : '1px solid rgb(209 213 219)',
      },
      boxShadow: 'none',
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: 'rgb(156 163 175)',
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      backgroundColor: 'transparent',
    }),
  }

  return <Select
    styles={customStyles}
    {...props}
  />
}
