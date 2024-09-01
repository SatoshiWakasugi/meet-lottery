import { FC } from 'preact/compat'

type Props = {
  children: React.ReactNode
  className?: string
}

export const Heading: FC<Props> = ({ children, className }) => {
  return (
    <h1 className={`text-5xl text-center font-serif ${className}`}>
      {children}
    </h1>
  )
}
