import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { RiCheckLine } from 'react-icons/ri'
import { HiSelector } from 'react-icons/hi'

export type SelectProps<T> = {
  value: T;
  setValue: (value: T) => void;
  values: T[];
  accessor: (value: T) => string;
  className?: string;
}

const Select = <T extends unknown>({ value, setValue, values, accessor, className }: SelectProps<T>) => {
  return <div className={className ?? "w-72"}>
    <Listbox value={value} onChange={setValue}>
      <div className="relative">
        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-50 dark:bg-gray-850 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
          <span className="block truncate">{accessor(value)}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <HiSelector
              className="w-5 h-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-gray-50 dark:bg-gray-850 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
            {values.map((person, key) => (
              <Listbox.Option
                key={key}
                className={({ active }) =>
                  `${active ? 'bg-sky-200 dark:bg-blue-900' : 'text-gray-900 dark:text-white'}
                        cursor-default select-none relative py-2 pl-10 pr-4 transition-colors duration-100`
                }
                value={person}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`${
                        selected ? 'font-medium' : 'font-normal'
                      } block truncate`}
                    >
                      {accessor(person)}
                    </span>
                    {selected ? (
                      <span
                        className={`${
                          active ? 'text-primary-light dark:text-blue-300' : 'text-primary-light dark:text-blue-300'
                        }
                              absolute inset-y-0 left-0 flex items-center pl-3`}
                      >
                        <RiCheckLine className="w-5 h-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  </div>
}

export default Select