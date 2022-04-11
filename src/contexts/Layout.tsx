import { FC, createContext, useContext } from 'react'

interface CreateContext {
  isDisplayed: (pathname: string) => boolean
}

interface Props {
  exclude: string[]
}

const LayoutContext = createContext<CreateContext>({} as CreateContext)

const LayoutProvider: FC<Props> = ({ children, exclude }) => {
  const isDisplayed = (pathname: string) => {
    return exclude.includes(pathname)
  }

  const value = { isDisplayed }

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  )
}

const useLayoutContext = () => useContext(LayoutContext)

export { LayoutContext, LayoutProvider, useLayoutContext }
